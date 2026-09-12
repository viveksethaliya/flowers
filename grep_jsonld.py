import glob
import re
import json

files = glob.glob('**/*.html', recursive=True)

for f in sorted(files):
    with open(f, 'r', encoding='latin1') as fp:
        content = fp.read()
    
    blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', content, re.DOTALL)
    for b in blocks:
        try:
            data = json.loads(b.strip())
            dtype = data.get('@type', 'UNKNOWN')
            print(f"{f}: @type={dtype}")
        except Exception as e:
            print(f"{f}: PARSE ERROR - {e}")
            print(f"  Raw: {b.strip()[:100]}")
