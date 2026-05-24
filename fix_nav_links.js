const fs = require('fs');
const path = require('path');

// ============================================================
// TASK 4: Fix Logo href="#" → href="/" on main pages
// ============================================================
const mainPages = ['index.html', 'about.html', 'contact.html', 'collection.html'];

mainPages.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(
    '<a href="#" class="logo">',
    '<a href="/" class="logo">'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('✅ Fixed logo href:', file);
  } else {
    console.log('⚠️  No logo change:', file);
  }
});

// ============================================================
// TASK 5: Fix Blog Nav Links — use dedicated pages
// blog.html uses ../index#about, ../index#products, ../index#contact
// Need to change to ../about, ../collection, ../contact
// Also fix Home link from ../index#home to ../
// ============================================================
const blogFiles = [
  'blog/blog.html',
  'blog/estimating-flower-stems-weddings.html',
  'blog/roses-vs-gerbera-vs-orchids.html',
  'blog/store-care-fresh-cut-flowers-bulk-orders.html',
  'blog/quarterly-seasonal-flower-sourcing-guide-india-2026.html',
  'blog/filler-flowers-beyond-babys-breath.html',
  'blog/top-5-wedding-flowers-2026.html',
  'blog/best-flowers-for-mandap-decoration.html',
];

blogFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix blog.html style nav links (uses ../index#section)
  content = content.replace(/href="\.\.\/index#home"/g, 'href="../"');
  content = content.replace(/href="\.\.\/index#about"/g, 'href="../about"');
  content = content.replace(/href="\.\.\/index#products"/g, 'href="../collection"');
  content = content.replace(/href="\.\.\/index#contact"/g, 'href="../contact"');
  content = content.replace(/href="\.\.\/index#logistics"/g, 'href="../#logistics"');

  // Fix other blog posts style nav links (uses ../#home → ../)
  content = content.replace(/href="\.\.\/index"/g, 'href="../"');
  content = content.replace(/href="\.\.\/index\b(?!#)/g, 'href="../');
  content = content.replace(/href="\.\.#home"/g, 'href="../"');
  content = content.replace(/href="\.\.\/\#home"/g, 'href="../"');

  // Fix logo link on blog pages (href="../index" → href="../")
  content = content.replace(
    'href="../index" class="logo"',
    'href="../" class="logo"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('✅ Fixed nav links:', file);
  } else {
    console.log('⚠️  No nav change:', file);
  }
});

// Also fix main page nav links that use index#logistics
mainPages.forEach(file => {
  if (file === 'index.html') return; // index.html uses #logistics which is correct
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // about, contact, collection pages use "index#logistics" → "/#logistics"
  content = content.replace(/href="index#logistics"/g, 'href="/#logistics"');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('✅ Fixed logistics link:', file);
  } else {
    console.log('⚠️  No logistics change:', file);
  }
});

// ============================================================
// TASK 6: Update Sitemap priorities & lastmod dates
// ============================================================
const sitemapPath = path.join(__dirname, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

const today = '2026-05-24';

// Update all lastmod dates to today
sitemap = sitemap.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

// Set blog post priorities to 0.8 (they were 1.0)
// Core pages stay at their current levels
// Homepage stays 1.0
// Blog index stays 0.8
// about, contact, collection stay 0.9
// Blog posts → 0.8

// First, set ALL to a temp marker to avoid double-replace issues
// Strategy: replace specific URLs with correct priority

const priorityMap = {
  'fleurvine.in/</loc>': '1.0',          // homepage
  'blog/blog</loc>': '0.8',              // blog index
  'about</loc>': '0.9',                  // about
  'contact</loc>': '0.9',                // contact
  'collection</loc>': '0.9',             // collection
};

// Set all blog post priorities to 0.8
sitemap = sitemap.replace(
  /(<loc>https:\/\/www\.fleurvine\.in\/blog\/(?!blog<)[^<]+<\/loc>\s*\n\s*<lastmod>[^<]+<\/lastmod>\s*\n\s*)<priority>[^<]+<\/priority>/g,
  '$1<priority>0.8</priority>'
);

fs.writeFileSync(sitemapPath, sitemap);
console.log('✅ Updated sitemap: lastmod dates → ' + today + ', blog priorities → 0.8');

console.log('\n🎉 All moderate navigation & linking changes completed!');
