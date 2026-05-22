const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('.git') && !dirFile.includes('node_modules') && !dirFile.includes('junk')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.html')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const htmlFiles = walkSync(__dirname);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Add height: auto to .post-content img inline styles
    content = content.replace(/\.post-content img\s*\{\s*width:\s*100%;\s*border-radius/g, '.post-content img {\n            width: 100%;\n            height: auto;\n            border-radius');

    // Also fix inline style on images like: <img src="..." style="width: 100%; ..."
    content = content.replace(/style=["']([^"']*)width:\s*100%;([^"']*)["']/g, (match, p1, p2) => {
        if (!p1.includes('height: auto') && !p2.includes('height: auto')) {
            return `style="${p1}width: 100%; height: auto;${p2}"`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Fixed stretched images in ${path.relative(__dirname, file)}`);
    }
});
