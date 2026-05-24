const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('.git') && !dirFile.includes('node_modules') && !dirFile.includes('.vscode') && !dirFile.includes('fvc')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.html') || dirFile.endsWith('.xml')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(__dirname);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Fix absolute URLs (e.g. canonical links) ending in .html
    content = content.replace(/href="(https:\/\/www\.fleurvine\.in\/[^"]+?)\.html"/g, 'href="$1"');
    
    // Fix sitemap.xml locs ending in .html
    content = content.replace(/<loc>(https:\/\/www\.fleurvine\.in\/[^<]+?)\.html<\/loc>/g, '<loc>$1</loc>');

    // Fix internal hrefs ending in .html (e.g., href="about.html")
    // Note: We use a regex to capture hrefs that don't start with http/mailto/tel and end with .html
    content = content.replace(/href="([^"#:]+?)\.html(#[^"]*)?"/g, 'href="$1$2"');
    
    // Fix internal action attributes for forms, e.g. action="contact.html"
    content = content.replace(/action="([^"#:]+?)\.html"/g, 'action="$1"');

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        changedFiles++;
        console.log('Fixed', file);
    }
});

console.log(`Updated ${changedFiles} files.`);
