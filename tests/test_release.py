import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('release', Path(__file__).resolve().parents[1]/'scripts/check_release.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class ReleaseTests(unittest.TestCase):
    def test_valid_directory_and_zip(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)/'dist'; root.mkdir()
            (root/'index.html').write_text('<script src="/sdk.js"></script>')
            self.assertEqual(m.inspect_release(root)['status'], 'PASS')
            z = Path(temp)/'game.zip'
            with zipfile.ZipFile(z, 'w') as f: f.write(root/'index.html', 'index.html')
            self.assertEqual(m.inspect_release(z)['status'], 'PASS')

    def test_bad_archive(self):
        with tempfile.TemporaryDirectory() as temp:
            z = Path(temp)/'bad.zip'
            with zipfile.ZipFile(z, 'w') as f:
                f.writestr('dist/index.html', 'game')
                f.writestr('../bad.js', 'window.YGDebugChecker={}')
                f.writestr('тест file.js', 'x')
                f.writestr('mock-sdk.js', 'x')
                f.writestr('empty folder/', '')
                f.writestr('A.js', 'x'); f.writestr('a.js', 'x')
            codes = {x['code'] for x in m.inspect_release(z)['findings']}
            self.assertTrue({'entrypoint','unsafe-path','filename','debug-content','debug-file','case-collision'} <= codes)
            self.assertFalse((Path(temp)/'bad.js').exists(), 'never extracts')

    def test_size_and_renamed_checker(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root/'index.html').write_text('x')
            # Marker straddles a scan chunk boundary.
            (root/'bundle.js').write_bytes(b'x'*65530+b'DEBUGCHECK_SELF_START')
            self.assertIn('debug-content', {x['code'] for x in m.inspect_release(root)['findings']})
            self.assertIn('size', {x['code'] for x in m.inspect_release(root, 5)['findings']})

    def test_symlinks_not_followed(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)/'dist'; root.mkdir()
            (root/'index.html').write_text('x')
            (root/'secret.js').symlink_to('/nonexistent/private')
            self.assertIn('symlink', {x['code'] for x in m.inspect_release(root)['findings']})

    def test_macos_metadata(self):
        with tempfile.TemporaryDirectory() as temp:
            z = Path(temp)/'finder.zip'
            with zipfile.ZipFile(z, 'w') as f:
                f.writestr('index.html', 'game')
                f.writestr('__MACOSX/._index.html', 'metadata')
            self.assertIn('development-file', {x['code'] for x in m.inspect_release(z)['findings']})

    def test_corrupt_zip_crc(self):
        with tempfile.TemporaryDirectory() as temp:
            z = Path(temp)/'bad.zip'
            with zipfile.ZipFile(z, 'w', compression=zipfile.ZIP_STORED) as f:
                f.writestr('index.html', 'unique-payload')
            z.write_bytes(z.read_bytes().replace(b'unique-payload', b'broken-payload'))
            self.assertIn('archive-integrity', {x['code'] for x in m.inspect_release(z)['findings']})

if __name__ == '__main__': unittest.main()
