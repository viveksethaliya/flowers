import glob
import re

files = glob.glob('**/*.html', recursive=True)

print("--- RELATIVE LINKS AUDIT ---")
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    for i, line in enumerate(lines):
        hrefs = re.findall(r'href="([^"]+)"', line)
        for h in hrefs:
            if not (h.startswith('http') or h.startswith('/') or h.startswith('#') or h.startswith('mailto:') or h.startswith('tel:') or h.startswith('data:')):
                print(f'Relative href in {f} line {i+1}: {h}')
        srcs = re.findall(r'src="([^"]+)"', line)
        for s in srcs:
            if not (s.startswith('http') or s.startswith('/') or s.startswith('data:')):
                print(f'Relative src in {f} line {i+1}: {s}')

print("--- METADATA AUDIT ---")
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    canonical = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content)
    canonical = canonical.group(1) if canonical else "MISSING"
    og_url = re.search(r'<meta\s+property="og:url"\s+content="([^"]+)"', content)
    og_url = og_url.group(1) if og_url else "MISSING"
    print(f'{f} | Canonical: {canonical} | OG:URL: {og_url}')

