#!/usr/bin/env python3
"""Read-only release artifact preflight, not a browser or moderation validator."""
import argparse
import json
import re
import stat
import zipfile
from pathlib import Path, PurePosixPath

DEFAULT_LIMIT = 100_000_000
DEBUG_MARKERS = (b'YGDebugChecker', b'DEBUGCHECK_SELF_START', b'YG DEBUG CHECKER REPORT')
MOCK_MARKERS = (b'Mock Yandex SDK', b'mock Yandex', b'__mockSDK')

def inspect_release(target, max_bytes=DEFAULT_LIMIT):
    target = Path(target)
    findings = []
    names = set()
    folded = set()
    total = 0
    count = 0
    archive = None

    def issue(code, file, detail):
        findings.append({'code': code, 'file': file, 'detail': detail})

    def metadata(name, size, symlink=False, is_dir=False):
        nonlocal total, count
        count += not is_dir
        total += size
        if name in names:
            issue('duplicate', name, 'Duplicate archive member')
        if name.casefold() in folded and name not in names:
            issue('case-collision', name, 'Case-insensitive filename collision')
        names.add(name)
        folded.add(name.casefold())
        parts = PurePosixPath(name).parts
        if name.startswith('/') or '\\' in name or '..' in parts or re.match(r'^[A-Za-z]:', name):
            issue('unsafe-path', name, 'Absolute or traversal path')
        if any(c.isspace() for c in name) or re.search(r'[\u0400-\u04ff]', name):
            issue('filename', name, 'Whitespace or Cyrillic in filename')
        if symlink:
            issue('symlink', name, 'Release must contain ordinary files, not symlinks')
        lower = name.lower()
        if any(part in ('.git', 'node_modules', '__macosx', '.dream-loop') for part in (x.casefold() for x in parts)) or PurePosixPath(name).name == '.DS_Store':
            issue('development-file', name, 'Development/system artifact in release')
        if 'debugcheck' in lower or re.search(r'(?:^|/)(?:mock[-_.]?sdk|sdk[-_.]?mock)(?:\.|/|$)', lower):
            issue('debug-file', name, 'Checker or mock SDK must not ship')

    def contents(name, opener):
        # Bound decompression globally before reaching here. Scan text in chunks
        # so a large ordinary bundle does not need to fit in memory.
        if Path(name).suffix.lower() not in ('.js', '.mjs', '.cjs', '.html', '.htm', '.json', '.map'):
            return
        found = set()
        tail = b''
        with opener() as stream:
            while chunk := stream.read(65536):
                block = tail + chunk
                for marker in DEBUG_MARKERS + MOCK_MARKERS:
                    if marker in block: found.add(marker)
                tail = block[-64:]
        if found:
            issue('debug-content', name, 'Recognized development instrumentation: ' + ', '.join(sorted(x.decode() for x in found)))

    try:
        entries = []
        if target.is_symlink():
            raise ValueError('Pass an actual output directory or ZIP, not a symlink')
        if target.is_dir():
            for p in sorted(target.rglob('*')):
                if p.is_symlink():
                    metadata(p.relative_to(target).as_posix(), 0, True)
                elif p.is_dir():
                    metadata(p.relative_to(target).as_posix() + '/', 0, is_dir=True)
                elif p.is_file():
                    name = p.relative_to(target).as_posix()
                    metadata(name, p.stat().st_size)
                    entries.append((name, lambda p=p: p.open('rb')))
        elif target.is_file() and zipfile.is_zipfile(target):
            archive = zipfile.ZipFile(target)
            for entry in archive.infolist():
                mode = entry.external_attr >> 16
                if entry.is_dir():
                    metadata(entry.filename, 0, stat.S_ISLNK(mode), is_dir=True)
                    continue
                metadata(entry.filename, entry.file_size, stat.S_ISLNK(mode))
                if entry.flag_bits & 1:
                    issue('encrypted', entry.filename, 'Encrypted entry cannot be hosted as an ordinary game asset')
                else:
                    entries.append((entry.filename, lambda e=entry: archive.open(e)))
        else:
            raise ValueError('Expected an existing output directory or valid ZIP archive')
        if 'index.html' not in names:
            issue('entrypoint', None, 'index.html must be at the archive/output root')
        if total > max_bytes:
            issue('size', None, f'{total} uncompressed bytes exceed configured cap {max_bytes}; content scan skipped')
        else:
            if archive:
                # Fully read entries to validate CRC, including binary assets.
                for e in archive.infolist():
                    if not e.is_dir() and not (e.flag_bits & 1):
                        try:
                            with archive.open(e) as stream:
                                while stream.read(65536): pass
                        except (zipfile.BadZipFile, RuntimeError, NotImplementedError, OSError) as exc:
                            issue('archive-integrity', e.filename, str(exc))
            for name, opener in entries:
                try:
                    contents(name, opener)
                except (zipfile.BadZipFile, RuntimeError, NotImplementedError, OSError) as exc:
                    issue('unreadable', name, str(exc))
    finally:
        if archive: archive.close()
    return {'artifact': str(target.resolve()), 'files': count, 'uncompressed_bytes': total,
            'max_bytes': max_bytes, 'status': 'FAIL' if findings else 'PASS', 'findings': findings,
            'scope': 'Artifact preflight only; runtime, draft and manual verification still required.'}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('artifact')
    parser.add_argument('--max-bytes', type=int, default=DEFAULT_LIMIT)
    args = parser.parse_args()
    if args.max_bytes <= 0: parser.error('--max-bytes must be positive')
    try:
        result = inspect_release(args.artifact, args.max_bytes)
    except (ValueError, OSError, zipfile.BadZipFile) as exc:
        print(json.dumps({'status': 'ERROR', 'error': str(exc)}))
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if result['findings'] else 0

if __name__ == '__main__':
    raise SystemExit(main())
