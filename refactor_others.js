const fs = require('fs');

const files = ['about.html', 'collection.html', 'contact.html'];

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');

    // Replace the large style block
    const styleRegex = /<style>([\s\S]*?)<\/style>/;
    html = html.replace(styleRegex, '<link rel="stylesheet" href="styles.css">');

    // Remove old inline scripts if they match what we had
    const scriptRegex1 = /<script>([\s\S]*?)<\/script>/g;
    const scriptRegex2 = /<script type="module">([\s\S]*?)<\/script>/g;
    
    // Instead of complex logic, if there is a script block we just replace the first script block we find
    // with our main.js, and remove the others, assuming they are duplicates of what was in index.html.
    // Wait, let's just do a clean replacement of ALL inline scripts with the one module script if they are huge.
    
    // Actually, safer: just remove all inline scripts that contain "const products =" or "import * as THREE"
    // and inject <script type="module" src="main.js"></script> before </body>.
    
    let hasMainJs = html.includes('src="main.js"');
    if (!hasMainJs) {
        html = html.replace(/<script>([\s\S]*?)<\/script>/, '<script type="module" src="main.js"></script>');
    }
    
    // remove the 3D module script if present
    html = html.replace(/<script type="module">([\s\S]*?)<\/script>/g, (match, p1) => {
        if (p1.includes('THREE.Scene')) {
            return '';
        }
        return match;
    });

    fs.writeFileSync(file, html);
    console.log(`Updated ${file}`);
});
