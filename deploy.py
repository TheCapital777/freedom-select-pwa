import os
import re
import subprocess
import urllib.request
import urllib.error
import json
import sys

# Force UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def strip_ansi(s):
    return re.sub(r'\x1b\[[0-9;]*m', '', s or '')

TOKEN = "nfc_hsU9n3rNXKmgJAVdParbEC92Xytovq35eb15"
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SITE_ID = "db3d6e80-d0a4-497a-969c-58ea65e351f5"  # already created

def netlify_post(path, body=None):
    url = f"https://api.netlify.com/api/v1{path}"
    data = json.dumps(body).encode() if body else b"{}"
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

site_id = SITE_ID
site_url = "https://freedom-select-tz.netlify.app"
print(f"Site: {site_url}  (id={site_id})")

print("\nStep 1 — building project...")
build = subprocess.run(
    "npm run build",
    cwd=PROJECT_DIR,
    capture_output=True,
    encoding="utf-8",
    errors="replace",
    shell=True,
)
if build.returncode != 0:
    print("BUILD FAILED:")
    print(build.stderr[-2000:])
    raise SystemExit(1)
print("  Build OK")

print("\nStep 2 — deploying to Netlify...")
out_dir = os.path.join(PROJECT_DIR, "out").replace("\\", "/")
deploy = subprocess.run(
    f'netlify deploy --prod --dir "{out_dir}" --site {site_id} --auth {TOKEN} --message "Freedom Select PWA Phase 1"',
    cwd=PROJECT_DIR,
    capture_output=True,
    encoding="utf-8",
    errors="replace",
    shell=True,
)
print(strip_ansi(deploy.stdout)[-3000:])
if deploy.returncode != 0:
    print("DEPLOY ERROR:")
    print(strip_ansi(deploy.stderr)[-2000:])
    raise SystemExit(1)

print(f"\nDone! Site live at: {site_url}")
