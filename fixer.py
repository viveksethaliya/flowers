import glob
import re
import os

files = glob.glob('**/*.html', recursive=True)

def replace_in_file(filepath):
    with open(filepath, 'rb') as fp:
        raw = fp.read()
    
    has_bom = raw.startswith(b'\xef\xbb\xbf')
    if has_bom:
        text = raw.decode('utf-8-sig')
    else:
        text = raw.decode('utf-8')
    
    # regex for hrefs that are relative
    def repl_href(m):
        full = m.group(0)
        h = m.group(1)
        if h.startswith('http') or h.startswith('/') or h.startswith('#') or h.startswith('mailto:') or h.startswith('tel:') or h.startswith('data:'):
            return full
        # fix it
        # cases: ../about -> /about
        # blog -> /blog
        # ../fvc/... -> /fvc/...
        if h.startswith('../'):
            new_h = '/' + h[3:]
        elif h == 'blog':
            new_h = '/blog'
        elif h == 'about':
            new_h = '/about'
        elif h == 'contact':
            new_h = '/contact'
        elif h == 'collection':
            new_h = '/collection'
        else:
            new_h = '/' + h
            
        return f'href="{new_h}"'
        
    def repl_src(m):
        full = m.group(0)
        s = m.group(1)
        if s.startswith('http') or s.startswith('/') or s.startswith('data:'):
            return full
        if s.startswith('../'):
            new_s = '/' + s[3:]
        else:
            # if we are in blog folder and image is img/..., it's /blog/img/...
            if 'blog\\' in filepath or 'blog/' in filepath:
                new_s = '/blog/' + s
            else:
                new_s = '/' + s
        return f'src="{new_s}"'

    new_text = re.sub(r'href="([^"]+)"', repl_href, text)
    new_text = re.sub(r'src="([^"]+)"', repl_src, new_text)
    
    # index.html og:url fix
    if filepath == 'index.html':
        new_text = new_text.replace('content="https://www.fleurvine.in"', 'content="https://www.fleurvine.in/"')

    if has_bom:
        new_raw = new_text.encode('utf-8-sig')
    else:
        new_raw = new_text.encode('utf-8')
        
    with open(filepath, 'wb') as fp:
        fp.write(new_raw)

for f in files:
    replace_in_file(f)
