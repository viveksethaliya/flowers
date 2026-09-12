import re

files = ['index.html', 'blog/index.html']

for f in files:
    with open(f, 'r', encoding='latin1') as fp:
        content = fp.read()
    
    match = re.search(r'<footer[\s\S]*?</footer>', content)
    if match:
        print(f"\n=== FOOTER: {f} ===")
        print(match.group(0))
    else:
        print(f"\n=== FOOTER: {f} === NOT FOUND")
