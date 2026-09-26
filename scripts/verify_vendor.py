#!/usr/bin/env python3
"""Verify the pinned snapshot and generated catalog; never download implicitly."""
import hashlib
import json
from pathlib import Path
from generate_catalog import render
ROOT = Path(__file__).resolve().parents[1]
lock = json.loads((ROOT/'vendor/checker-lock.json').read_text())
base = ROOT/'vendor/yandex-games-debug-checker'
actual = {str(p.relative_to(base)): hashlib.sha256(p.read_bytes()).hexdigest()
          for p in sorted(base.rglob('*')) if p.is_file()}
assert actual == lock['files'], 'Vendored snapshot changed; inspect provenance before updating the lock'
assert (ROOT/'references/check-catalog.md').read_text() == render(), 'Regenerate the catalog'
print(f"vendor: PASS — {len(actual)} files pinned at {lock['commit']}; catalog current")
