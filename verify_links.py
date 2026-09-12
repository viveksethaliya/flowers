import glob
import re
import os

files = glob.glob('**/*.html', recursive=True)

target_files = [
    'blog\\estimating-flower-stems-weddings.html',
    'blog\\filler-flowers-beyond-babys-breath.html',
    'blog\\quarterly-seasonal-flower-sourcing-guide-india-2026.html',
    'blog\\roses-vs-gerbera-vs-orchids.html',
    'blog\\store-care-fresh-cut-flowers-bulk-orders.html',
    'blog\\top-5-wedding-flowers-2026.html',
    'blog\\ultimate-wedding-flower-calculator.html'
]
# normalize target files to match glob output
target_files = [f.replace('\\', os.sep).replace('/', os.sep) for f in target_files]

def resolve_path(url, current_file):
    if '#' in url:
        url = url.split('#')[0]
    if not url:
        return True
    if url.startswith('http') or url.startswith('mailto:') or url.startswith('tel:') or url.startswith('data:'):
        return True
        
    if url.startswith('/'):
        abs_path = url
    else:
        dir_name = '/' + os.path.dirname(current_file).replace('\\', '/')
        if dir_name == '/':
            abs_path = '/' + url
        else:
            abs_path = dir_name + '/' + url
            
    if abs_path == '/':
        target = 'index.html'
    elif abs_path.endswith('/'):
        target = abs_path[1:] + 'index.html'
    else:
        target = abs_path[1:]
        if not os.path.exists(target):
            if os.path.exists(target + '.html'):
                target = target + '.html'
            elif os.path.exists(target + '/index.html'):
                target = target + '/index.html'

    return os.path.exists(target)

total_count = 0

print(f"{'FILE':<60} | {'LINE':<5} | {'HREF/SRC':<80} | STATUS")
print("-" * 160)

for f in files:
    with open(f, 'r', encoding='latin1') as fp:
        lines = fp.readlines()
        
    for i, line in enumerate(lines):
        links = re.findall(r'(?:href|src)="([^"]+)"', line)
        for link in links:
            total_count += 1
            resolves = resolve_path(link, f)
            status = 'RESOLVES' if resolves else 'BROKEN'
            
            if f in target_files:
                print(f"{f:<60} | {i+1:<5} | {link:<80} | {status}")

print("-" * 160)
print(f"Total attributes examined across all 13 files: {total_count}")
