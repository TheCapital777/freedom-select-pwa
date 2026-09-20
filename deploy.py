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

# ─────────────────────────────────────────────────────────────────────────────
# Netlify credentials.
#
# This was a hardcoded personal access token, committed to a PUBLIC GitHub repo.
# A Netlify PAT is account-wide: it can deploy to, reconfigure or delete every
# site on the account and read their environment variables. That token is revoked.
#
# The replacement is read at runtime and never stored in this file:
#   1. NETLIFY_AUTH_TOKEN in the environment, or
#   2. NETLIFY_AUTH_TOKEN=... in .env.local beside this script (gitignored)
#
# Never paste a token into this file, and never into a chat window.
# ─────────────────────────────────────────────────────────────────────────────

def _load_token() -> str:
    token = os.environ.get("NETLIFY_AUTH_TOKEN", "").strip()
    if token:
        return token

    here = os.path.dirname(os.path.abspath(__file__))
    for name in (".env.local", ".env"):
        path = os.path.join(here, name)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if line.startswith("NETLIFY_AUTH_TOKEN="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")

    raise SystemExit(
        "\nNo Netlify token found.\n\n"
        "Create a file called .env.local next to this script, containing one line:\n\n"
        "    NETLIFY_AUTH_TOKEN=your-token-here\n\n"
        ".env.local is gitignored, so it will never be committed.\n"
        "Get a token at https://app.netlify.com/user/applications\n"
    )


TOKEN = _load_token()
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SITE_ID = "f2b473ea-442c-4dee-8079-f48c9e5923bd"  # freedom-select-pwa
# History of this line, because it has been wrong twice:
#   db3d6e80-…  original value; that site no longer existed, so the script would
#               have failed rather than deployed anywhere
#   b831ca0d-…  the real freedom-select-pwa, deleted 20 Sep 2026
#   f2b473ea-…  its replacement, created the same day under the SAME name so the
#               URL and any installed PWA survive the swap
# Verified against the API: name freedom-select-pwa -> freedom-select-pwa.netlify.app
# If you ever change this, confirm the id against the name first. There are 55
# similarly named sites on this account.

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
site_url = "https://freedom-select-pwa.netlify.app"  # was …-tz, which is not this site
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

# ── Step 1b: bust the service-worker cache ───────────────────────────────────
# sw.js is cache-first with background revalidation, and its `activate` handler
# deletes every cache whose name is not CACHE_NAME. So a deploy that leaves that
# name unchanged serves returning visitors the PREVIOUS build for a whole load —
# which is exactly how the first deploy of the icon work went out looking
# unchanged on an already-visited browser.
#
# Stamped in public/, NOT out/: netlify.toml sets command = "npm run build", so the
# Netlify CLI rebuilds out/ during the deploy and overwrites anything written there.
# That cost one deploy to find. Aborts rather than shipping a stale cache key.
sw_path = os.path.join(PROJECT_DIR, "public", "sw.js")
if not os.path.exists(sw_path):
    raise SystemExit("  ABORT: public/sw.js missing - refusing to deploy without a cache stamp")

import time

_stamp = time.strftime("%Y%m%d-%H%M%S")
with open(sw_path, encoding="utf-8") as fh:
    _sw = fh.read()
_new = re.sub(r'const CACHE_NAME = "[^"]+";',
              'const CACHE_NAME = "freedom-select-%s";' % _stamp, _sw, count=1)
if _new == _sw:
    raise SystemExit("  ABORT: could not stamp CACHE_NAME in out/sw.js - "
                     "returning visitors would be served a stale build")
with open(sw_path, "w", encoding="utf-8") as fh:
    fh.write(_new)
print("  Service-worker cache stamped: freedom-select-%s" % _stamp)

print("\nStep 2 — deploying to Netlify...")
out_dir = os.path.join(PROJECT_DIR, "out").replace("\\", "/")
# The token goes in the environment, not on the command line: argv is visible to
# anything that can list processes, and it lands in shell history.
_env = {**os.environ, "NETLIFY_AUTH_TOKEN": TOKEN}
deploy = subprocess.run(
    f'netlify deploy --prod --dir "{out_dir}" --site {site_id} --message "Premium pass: SVG icons, contrast, no hardcoded token"',
    cwd=PROJECT_DIR,
    capture_output=True,
    encoding="utf-8",
    errors="replace",
    shell=True,
    env=_env,
)
print(strip_ansi(deploy.stdout)[-3000:])
if deploy.returncode != 0:
    print("DEPLOY ERROR:")
    print(strip_ansi(deploy.stderr)[-2000:])
    raise SystemExit(1)

print(f"\nDone! Site live at: {site_url}")
