const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const walkSync = function(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('.git') && !dirFile.includes('node_modules') && !dirFile.includes('.vscode')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const allFiles = walkSync(__dirname);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const imageFiles = allFiles.filter(f => /\.(png|jpe?g|webp|gif|svg)$/i.test(f));

const report = {
    multipleTitles: [],
    missingCanonicals: [],
    exactDuplicates: [],
    largeImages: [],
    duplicateTitles: [],
    longTitles: [],
    canonicalised: []
};

const hashes = {};
const titles = {};

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');

    // 1. Multiple titles
    const titleMatches = content.match(/<title[^>]*>.*?<\/title>/gi);
    if (titleMatches && titleMatches.length > 1) {
        report.multipleTitles.push({ file: relativePath, count: titleMatches.length });
    }

    // 2. Titles parsing for duplicates & length
    let titleText = '';
    if (titleMatches && titleMatches.length > 0) {
        titleText = titleMatches[0].replace(/<[^>]+>/g, '').trim();
        if (titleText.length > 60) {
            report.longTitles.push({ file: relativePath, length: titleText.length, title: titleText });
        }
        if (!titles[titleText]) titles[titleText] = [];
        titles[titleText].push(relativePath);
    }

    // 3. Missing canonicals
    const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (!canonicalMatch) {
        report.missingCanonicals.push(relativePath);
    } else {
        // 4. Canonicalised (canonical points to a URL that doesn't match the current file path)
        const canonicalUrl = canonicalMatch[1];
        // The URL should normally end with the relative path or similar.
        // Let's just check if it matches the expected URL format.
        let expectedEnding = relativePath === 'index.html' ? '/' : '/' + relativePath;
        if (!canonicalUrl.endsWith(expectedEnding)) {
             // For index.html, it might just end with .in/
             // For others, it should end with .in/relativePath
             report.canonicalised.push({ file: relativePath, canonicalUrl });
        }
    }

    // 5. Exact Duplicates
    const hash = crypto.createHash('md5').update(content).digest('hex');
    if (!hashes[hash]) hashes[hash] = [];
    hashes[hash].push(relativePath);
});

// Process duplicates
Object.keys(titles).forEach(title => {
    if (titles[title].length > 1) {
        report.duplicateTitles.push({ title, files: titles[title] });
    }
});

Object.keys(hashes).forEach(hash => {
    if (hashes[hash].length > 1) {
        report.exactDuplicates.push(hashes[hash]);
    }
});

// 6. Large images
imageFiles.forEach(file => {
    const stats = fs.statSync(file);
    if (stats.size > 100 * 1024) { // > 100 KB
        report.largeImages.push({ file: path.relative(__dirname, file).replace(/\\/g, '/'), sizeKB: Math.round(stats.size / 1024) });
    }
});

console.log(JSON.stringify(report, null, 2));
