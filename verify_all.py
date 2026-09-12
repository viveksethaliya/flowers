import glob, re, os

files = glob.glob('**/*.html', recursive=True)

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
        abs_path = (dir_name + '/' + url) if dir_name != '/' else '/' + url
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

total = 0
broken = []
for f in sorted(files):
    with open(f, 'r', encoding='latin1') as fp:
        lines = fp.readlines()
    for i, line in enumerate(lines):
        links = re.findall(r'(?:href|src)="([^"]+)"', line)
        for link in links:
            total += 1
            if not resolve_path(link, f):
                broken.append(f'{f}:{i+1}: {link}')

print(f'Total attributes: {total}')
print(f'Broken: {len(broken)}')
for b in broken:
    print(f'  BROKEN: {b}')
