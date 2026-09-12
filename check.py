import subprocess
import re

commits = ['68eb4bc', 'a149893', 'd34491a', '02607c5', 'fed3ce5']
f = 'blog/top-5-wedding-flowers-2026.html'

for c in commits:
    try:
        raw = subprocess.check_output(['git', 'show', f'{c}:{f}'])
        match = re.search(b'Fleur <span>(.*?)</span>', raw)
        if match:
            char_bytes = match.group(1)
            print(f'{c} {f}: {char_bytes.hex(" ").upper()}')
        else:
            print(f'{c} {f}: Pattern not found')
    except Exception as e:
        print(f'{c} {f}: Error - {e}')
