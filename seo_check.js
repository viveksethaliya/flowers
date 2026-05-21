const fs = require('fs');
const files = ['index.html', 'about.html', 'collection.html', 'contact.html'];

files.forEach(f => {
    const html = fs.readFileSync(f, 'utf8');
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i) || 
                      html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["'][^>]*>/i);
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["'](.*?)["'][^>]*>/i);
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

    console.log(`--- ${f} ---`);
    console.log(`Title: ${titleMatch ? titleMatch[1].trim() : 'NONE'}`);
    console.log(`Description: ${descMatch ? descMatch[1].trim() : 'NONE'}`);
    console.log(`Canonical: ${canonicalMatch ? canonicalMatch[1].trim() : 'NONE'}`);
    console.log(`H1: ${h1Match ? h1Match[1].trim().replace(/\n/g, ' ') : 'NONE'}`);
});
