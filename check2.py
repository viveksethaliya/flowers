import subprocess
import re

commits = ['02607c5', 'fed3ce5']
files = ['index.html', 'about.html']

for c in commits:
    for f in files:
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
