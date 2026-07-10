#!/usr/bin/env python3
"""Bundle the modular game into one self-contained HTML file.
Usage: python3 tools/build_single.py
Output: dist/nebula-force-act1.html — playable anywhere as a single file."""
import re, pathlib
root=pathlib.Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text(encoding='utf-8')
css=(root/'css/style.css').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="css/style.css">', '<style>\n'+css+'\n</style>')
html=re.sub(r'\n<link rel="manifest"[^>]*>','',html)
html=re.sub(r'\n<link rel="apple-touch-icon"[^>]*>','',html)
def repl(m):
    js=(root/m.group(1)).read_text(encoding='utf-8')
    return '<script>\n'+js+'\n</script>'
html=re.sub(r'<script src="([^"]+)"></script>', repl, html)
out=root/'dist/nebula-force-act1.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print('built', out, len(html), 'bytes')
