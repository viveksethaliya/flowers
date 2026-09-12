import glob
import re
import json

files = ['index.html', 'contact.html']

for f in files:
    with open(f, 'r', encoding='latin1') as fp:
        content = fp.read()
    
    blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', content, re.DOTALL)
    for b in blocks:
        data = json.loads(b.strip())
        dtype = data.get('@type', 'UNKNOWN')
        print(f"\n=== {f}: @type={dtype} ===")
        print(json.dumps(data, indent=2))
