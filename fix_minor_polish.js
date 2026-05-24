const fs = require('fs');
const path = require('path');

// ============================================================
// TASK 7: Add Twitter Card Meta Tags to Main Pages
// ============================================================

const twitterCards = {
  'index.html': {
    card: 'summary_large_image',
    title: 'Wholesale Bulk Flowers in India for Events | Fleur Vine',
    description: 'Fleur Vine is a leading B2B supplier of fresh-cut wholesale flowers in India. Ideal for weddings, mandap decorations, corporate events, and bulk export.',
    image: 'https://www.fleurvine.in/media/logo.webp',
  },
  'about.html': {
    card: 'summary_large_image',
    title: 'About Us | Professional B2B Floral Partner | Fleur Vine',
    description: 'Learn about Fleur Vine, your dedicated B2B floral procurement partner for the event management and décor industry.',
    image: 'https://www.fleurvine.in/media/logo.webp',
  },
  'contact.html': {
    card: 'summary_large_image',
    title: 'Contact Us | Bulk Flower Orders | Fleur Vine',
    description: 'Contact Fleur Vine for bulk flower supply and B2B enquiries. Call, WhatsApp, or email us to discuss your event floral needs.',
    image: 'https://www.fleurvine.in/media/logo.webp',
  },
  'collection.html': {
    card: 'summary_large_image',
    title: 'Wholesale Collection | Bulk Flowers | Fleur Vine',
    description: 'Browse Fleur Vine\'s wholesale flower collection. We supply premium export-grade roses, chrysanthemums, and orchids for events and weddings.',
    image: 'https://www.fleurvine.in/media/logo.webp',
  },
};

Object.entries(twitterCards).forEach(([file, meta]) => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Check if twitter card already exists
  if (content.includes('twitter:card')) {
    console.log('⚠️  Twitter card already exists:', file);
    return;
  }

  const twitterTags = `
    <!-- Twitter Card -->
    <meta name="twitter:card" content="${meta.card}">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.description}">
    <meta name="twitter:image" content="${meta.image}">
`;

  // Insert after the og:image tag
  content = content.replace(
    /(<meta property="og:image"[^>]+>)\r?\n/,
    `$1\r\n${twitterTags}`
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('✅ Added Twitter Card:', file);
  } else {
    console.log('⚠️  Could not insert Twitter Card:', file);
  }
});

// ============================================================
// TASK 8: Fix HTML Footer Nesting on about, contact, collection
// These pages have stray </div></section> after the footer
// The footer sits outside its parent section improperly
// ============================================================

// about.html: lines 204-211 — footer is outside <section> but wrapped in stray </div></section>
const aboutPath = path.join(__dirname, 'about.html');
let aboutContent = fs.readFileSync(aboutPath, 'utf8');
let aboutOriginal = aboutContent;

// The pattern: </section> then <footer>...</footer> then </div></section> (stray)
aboutContent = aboutContent.replace(
  /    <\/section>\r?\n\r?\n            <footer class="main-footer">\r?\n                <div class="footer-bottom">\r?\n                    <p>&copy; 2026 Fleur Vine\. All rights reserved\.<\/p>\r?\n                    <p>Fresh-Cut Flowers for Events, Wholesale & Export Supply<\/p>\r?\n                <\/div>\r?\n            <\/footer>\r?\n        <\/div>\r?\n    <\/section>/,
  `    </section>

    <footer class="main-footer">
        <div class="footer-bottom">
            <p>&copy; 2026 Fleur Vine. All rights reserved.</p>
            <p>Fresh-Cut Flowers for Events, Wholesale &amp; Export Supply</p>
        </div>
    </footer>`
);

if (aboutContent !== aboutOriginal) {
  fs.writeFileSync(aboutPath, aboutContent);
  console.log('✅ Fixed footer nesting: about.html');
} else {
  console.log('⚠️  No footer change: about.html');
}

// collection.html: same pattern
const collectionPath = path.join(__dirname, 'collection.html');
let collectionContent = fs.readFileSync(collectionPath, 'utf8');
let collectionOriginal = collectionContent;

collectionContent = collectionContent.replace(
  /            <footer class="main-footer">\r?\n                <div class="footer-bottom">\r?\n                    <p>&copy; 2026 Fleur Vine\. All rights reserved\.<\/p>\r?\n                    <p>Fresh-Cut Flowers for Events, Wholesale & Export Supply<\/p>\r?\n                <\/div>\r?\n            <\/footer>\r?\n        <\/div>\r?\n    <\/section>/,
  `    <footer class="main-footer">
        <div class="footer-bottom">
            <p>&copy; 2026 Fleur Vine. All rights reserved.</p>
            <p>Fresh-Cut Flowers for Events, Wholesale &amp; Export Supply</p>
        </div>
    </footer>`
);

if (collectionContent !== collectionOriginal) {
  fs.writeFileSync(collectionPath, collectionContent);
  console.log('✅ Fixed footer nesting: collection.html');
} else {
  console.log('⚠️  No footer change: collection.html');
}

// contact.html: same pattern
const contactPath = path.join(__dirname, 'contact.html');
let contactContent = fs.readFileSync(contactPath, 'utf8');
let contactOriginal = contactContent;

contactContent = contactContent.replace(
  /            <footer class="main-footer">\r?\n                <div class="footer-bottom">\r?\n                    <p>&copy; 2026 Fleur Vine\. All rights reserved\.<\/p>\r?\n                    <p>Fresh-Cut Flowers for Events, Wholesale & Export Supply<\/p>\r?\n                <\/div>\r?\n            <\/footer>\r?\n        <\/div>\r?\n    <\/section>/,
  `    <footer class="main-footer">
        <div class="footer-bottom">
            <p>&copy; 2026 Fleur Vine. All rights reserved.</p>
            <p>Fresh-Cut Flowers for Events, Wholesale &amp; Export Supply</p>
        </div>
    </footer>`
);

if (contactContent !== contactOriginal) {
  fs.writeFileSync(contactPath, contactContent);
  console.log('✅ Fixed footer nesting: contact.html');
} else {
  console.log('⚠️  No footer change: contact.html');
}

console.log('\n🎉 All minor polish changes completed!');
