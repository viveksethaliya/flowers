import glob
import re
import os

slugs = [
    'best-flowers-for-mandap-decoration',
    'estimating-flower-stems-weddings',
    'filler-flowers-beyond-babys-breath',
    'quarterly-seasonal-flower-sourcing-guide-india-2026',
    'roses-vs-gerbera-vs-orchids',
    'store-care-fresh-cut-flowers-bulk-orders',
    'top-5-wedding-flowers-2026',
    'ultimate-wedding-flower-calculator'
]

files = glob.glob('**/*.html', recursive=True)

def replace_in_file(filepath):
    with open(filepath, 'rb') as fp:
        raw = fp.read()
    
    has_bom = raw.startswith(b'\xef\xbb\xbf')
    if has_bom:
        text = raw.decode('utf-8-sig')
    else:
        # latin1 to perfectly preserve corrupt bytes
        text = raw.decode('latin1')
        
    def repl_href(m):
        full = m.group(0)
        h = m.group(1)
        for slug in slugs:
            if h == slug or h == '/' + slug:
                return f'href="/blog/{slug}"'
        return full
        
    new_text = re.sub(r'href="([^"]+)"', repl_href, text)
    
    # check if there's any /img/ that should be /blog/img/ (wait, only if it's broken, we will fix later)
    # let's just write this back
    
    if has_bom:
        new_raw = new_text.encode('utf-8-sig')
    else:
        new_raw = new_text.encode('latin1')
        
    with open(filepath, 'wb') as fp:
        fp.write(new_raw)

for f in files:
    replace_in_file(f)
