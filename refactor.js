const fs = require('fs');

const htmlPath = 'index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract CSS
const styleRegex = /<style>([\s\S]*?)<\/style>/;
const styleMatch = html.match(styleRegex);
if (styleMatch) {
    fs.writeFileSync('styles.css', styleMatch[1].trim() + '\n');
    console.log('Created styles.css');
}

// Extract JS
const scriptRegex1 = /<script>([\s\S]*?)<\/script>/;
const scriptRegex2 = /<script type="module">([\s\S]*?)<\/script>/;

const scriptMatch1 = html.match(scriptRegex1);
const scriptMatch2 = html.match(scriptRegex2);

let mainJsContent = '';
if (scriptMatch1) {
    mainJsContent += scriptMatch1[1].trim() + '\n\n';
}
if (scriptMatch2) {
    mainJsContent += scriptMatch2[1].trim() + '\n';
}

if (mainJsContent) {
    fs.writeFileSync('main.js', mainJsContent);
    console.log('Created main.js');
}

// Replace in HTML
let newHtml = html;
if (styleMatch) {
    newHtml = newHtml.replace(styleMatch[0], '<link rel="stylesheet" href="styles.css">');
}
if (scriptMatch1) {
    newHtml = newHtml.replace(scriptMatch1[0], '<script type="module" src="main.js"></script>');
}
if (scriptMatch2) {
    newHtml = newHtml.replace(scriptMatch2[0], ''); // Remove the second one entirely
}

fs.writeFileSync(htmlPath, newHtml);
console.log('Updated index.html');
