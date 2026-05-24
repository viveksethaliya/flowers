const fs = require('fs');
const path = require('path');

// ============================================================
// TASK 1: Upgrade existing Article schemas to BlogPosting + fix URLs
// Files: roses, store-care, quarterly, filler
// ============================================================
const schemaFixFiles = [
  'blog/roses-vs-gerbera-vs-orchids.html',
  'blog/store-care-fresh-cut-flowers-bulk-orders.html',
  'blog/quarterly-seasonal-flower-sourcing-guide-india-2026.html',
  'blog/filler-flowers-beyond-babys-breath.html',
];

schemaFixFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Change @type from Article to BlogPosting
  content = content.replace('"@type": "Article"', '"@type": "BlogPosting"');

  // Fix mainEntityOfPage URLs - remove .html
  content = content.replace(
    /("mainEntityOfPage":\s*"https:\/\/www\.fleurvine\.in\/blog\/[^"]+?)\.html"/g,
    '$1"'
  );

  // Fix logo URL: logo.webp -> media/logo.webp
  content = content.replace(
    /"url": "https:\/\/www\.fleurvine\.in\/logo\.webp"/g,
    '"url": "https://www.fleurvine.in/media/logo.webp"'
  );

  // Add author URL
  content = content.replace(
    '"name": "Fleur Vine Team"\n      }',
    '"name": "Fleur Vine Team",\n        "url": "https://www.fleurvine.in"\n      }'
  );
  // Also handle \r\n
  content = content.replace(
    '"name": "Fleur Vine Team"\r\n      }',
    '"name": "Fleur Vine Team",\r\n        "url": "https://www.fleurvine.in"\r\n      }'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('✅ Upgraded schema:', file);
  } else {
    console.log('⚠️  No changes:', file);
  }
});

// ============================================================
// TASK 2: Fix mandap blog BlogPosting schema URLs
// ============================================================
const mandapPath = path.join(__dirname, 'blog/best-flowers-for-mandap-decoration.html');
let mandapContent = fs.readFileSync(mandapPath, 'utf8');
let mandapOriginal = mandapContent;

// Fix mainEntityOfPage URL
mandapContent = mandapContent.replace(
  '"@id": "https://www.fleurvine.in/blog/best-flowers-for-mandap-decoration.html"',
  '"@id": "https://www.fleurvine.in/blog/best-flowers-for-mandap-decoration"'
);

// Fix og:url
mandapContent = mandapContent.replace(
  'content="https://www.fleurvine.in/blog/best-flowers-for-mandap-decoration.html"',
  'content="https://www.fleurvine.in/blog/best-flowers-for-mandap-decoration"'
);

// Add FAQPage schema before </head>
const mandapFAQSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which flowers are best for mandap decoration?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Roses, marigolds, orchids, and carnations are the most reliable and popular choices for mandap decoration, offering a mix of tradition, volume, and luxury."
          }
        },
        {
          "@type": "Question",
          "name": "Which flowers last longest in wedding mandaps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Carnations, orchids, and marigolds have excellent durability and can easily survive multi-day events without water tubes if pre-hydrated correctly."
          }
        },
        {
          "@type": "Question",
          "name": "Are fresh flowers better than artificial flowers for weddings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While artificial flowers are reusable, fresh flowers provide unmatched fragrance, authenticity, and premium aesthetic value that elevates the entire wedding experience and photography."
          }
        }
      ]
    }
    </script>
`;

mandapContent = mandapContent.replace(
  '    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"',
  mandapFAQSchema + '\r\n    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"'
);

if (mandapContent !== mandapOriginal) {
  fs.writeFileSync(mandapPath, mandapContent);
  console.log('✅ Fixed mandap blog schema + added FAQPage');
} else {
  console.log('⚠️  No changes to mandap blog');
}

// ============================================================
// TASK 3: Add BlogPosting schema to estimating-flower-stems-weddings.html
// ============================================================
const estimatingPath = path.join(__dirname, 'blog/estimating-flower-stems-weddings.html');
let estimatingContent = fs.readFileSync(estimatingPath, 'utf8');

const estimatingSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.fleurvine.in/blog/estimating-flower-stems-weddings"
      },
      "headline": "Estimating Bulk Flower Stem Counts for Weddings",
      "description": "A calculator-style guide to help event planners determine flower requirements. Get bulk flower stem counts for mandaps, centerpieces, and more.",
      "image": "https://www.fleurvine.in/blog/img/gypsophila.webp",
      "author": {
        "@type": "Organization",
        "name": "Fleur Vine Team",
        "url": "https://www.fleurvine.in"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Fleur Vine",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.fleurvine.in/media/logo.webp"
        }
      },
      "datePublished": "2026-03-05",
      "dateModified": "2026-03-05"
    }
    </script>
`;

estimatingContent = estimatingContent.replace(
  '    <!-- Security Headers -->\n    <meta http-equiv="Content-Security-Policy"',
  estimatingSchema + '\n    <!-- Security Headers -->\n    <meta http-equiv="Content-Security-Policy"'
);

// Also fix og:url
estimatingContent = estimatingContent.replace(
  'content="https://www.fleurvine.in/blog/estimating-flower-stems-weddings.html"',
  'content="https://www.fleurvine.in/blog/estimating-flower-stems-weddings"'
);

fs.writeFileSync(estimatingPath, estimatingContent);
console.log('✅ Added BlogPosting schema to estimating blog');

// ============================================================
// TASK 4: Add BlogPosting schema to top-5-wedding-flowers-2026.html
// ============================================================
const top5Path = path.join(__dirname, 'blog/top-5-wedding-flowers-2026.html');
let top5Content = fs.readFileSync(top5Path, 'utf8');

const top5Schema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.fleurvine.in/blog/top-5-wedding-flowers-2026"
      },
      "headline": "Top 5 Flowers for Weddings in 2026",
      "description": "Discover the top 5 trending wedding flowers for 2026 including white roses, orchids, and gerberas. Perfect for Indian weddings and bulk floral sourcing.",
      "image": "https://www.fleurvine.in/blog/img/rose.webp",
      "author": {
        "@type": "Organization",
        "name": "Fleur Vine Team",
        "url": "https://www.fleurvine.in"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Fleur Vine",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.fleurvine.in/media/logo.webp"
        }
      },
      "datePublished": "2026-03-01",
      "dateModified": "2026-03-01"
    }
    </script>
`;

// Fix og:url
top5Content = top5Content.replace(
  'content="https://www.fleurvine.in/blog/top-5-wedding-flowers-2026.html"',
  'content="https://www.fleurvine.in/blog/top-5-wedding-flowers-2026"'
);

top5Content = top5Content.replace(
  '    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"',
  top5Schema + '\r\n    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"'
);

fs.writeFileSync(top5Path, top5Content);
console.log('✅ Added BlogPosting schema to top-5 blog');

// ============================================================
// TASK 5: Add CollectionPage schema to blog/blog.html
// ============================================================
const blogIndexPath = path.join(__dirname, 'blog/blog.html');
let blogIndexContent = fs.readFileSync(blogIndexPath, 'utf8');

const blogIndexSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Fleur Vine Blog — Floral Insights for Event Professionals",
      "description": "Industry news, trends, and advice on bulk flower procurement for event professionals.",
      "url": "https://www.fleurvine.in/blog/blog",
      "publisher": {
        "@type": "Organization",
        "name": "Fleur Vine",
        "url": "https://www.fleurvine.in",
        "logo": "https://www.fleurvine.in/media/logo.webp"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "url": "https://www.fleurvine.in/blog/best-flowers-for-mandap-decoration"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "url": "https://www.fleurvine.in/blog/filler-flowers-beyond-babys-breath"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "url": "https://www.fleurvine.in/blog/quarterly-seasonal-flower-sourcing-guide-india-2026"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "url": "https://www.fleurvine.in/blog/top-5-wedding-flowers-2026"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "url": "https://www.fleurvine.in/blog/store-care-fresh-cut-flowers-bulk-orders"
          },
          {
            "@type": "ListItem",
            "position": 6,
            "url": "https://www.fleurvine.in/blog/roses-vs-gerbera-vs-orchids"
          },
          {
            "@type": "ListItem",
            "position": 7,
            "url": "https://www.fleurvine.in/blog/estimating-flower-stems-weddings"
          }
        ]
      }
    }
    </script>
`;

blogIndexContent = blogIndexContent.replace(
  '    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"',
  blogIndexSchema + '\r\n    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"'
);

// Fix og:image path
blogIndexContent = blogIndexContent.replace(
  'content="https://www.fleurvine.in/logo.webp"',
  'content="https://www.fleurvine.in/media/logo.webp"'
);

fs.writeFileSync(blogIndexPath, blogIndexContent);
console.log('✅ Added CollectionPage + ItemList schema to blog index');

// ============================================================
// TASK 6: Add FAQPage schema to contact.html
// ============================================================
const contactPath = path.join(__dirname, 'contact.html');
let contactContent = fs.readFileSync(contactPath, 'utf8');

const contactFAQSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Minimum Order Quantity (MOQ)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our minimum order quantity is 500 stems per variety, to ensure we can provide the best wholesale pricing and dedicate the proper cold-chain logistics to your order."
          }
        },
        {
          "@type": "Question",
          "name": "How much notice is required?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We request at least 7-10 days' notice for standard bulk orders. For specialty or exotic imports, we recommend reaching out 3-4 weeks in advance of your event date."
          }
        },
        {
          "@type": "Question",
          "name": "Do you deliver outside major cities?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We utilize a robust network of road and air transport to deliver to almost any venue in India, ensuring the cold chain is maintained throughout transit."
          }
        },
        {
          "@type": "Question",
          "name": "What are the payment terms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We operate on a Quote-to-Invoice basis. A 50% advance is required to lock in the allocation and pricing, with the balance due before dispatch."
          }
        }
      ]
    }
    </script>
`;

contactContent = contactContent.replace(
  '    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"',
  contactFAQSchema + '\r\n    <!-- Security Headers -->\r\n    <meta http-equiv="Content-Security-Policy"'
);

fs.writeFileSync(contactPath, contactContent);
console.log('✅ Added FAQPage schema to contact page');

// ============================================================
// TASK 7: Fix remaining og:url .html references across blog posts
// ============================================================
const ogFixFiles = [
  'blog/roses-vs-gerbera-vs-orchids.html',
  'blog/store-care-fresh-cut-flowers-bulk-orders.html',
  'blog/quarterly-seasonal-flower-sourcing-guide-india-2026.html',
  'blog/filler-flowers-beyond-babys-breath.html',
];

ogFixFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix og:url containing .html
  content = content.replace(
    /content="(https:\/\/www\.fleurvine\.in\/blog\/[^"]+?)\.html"/g,
    'content="$1"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('✅ Fixed og:url in:', file);
  }
});

console.log('\n🎉 All critical SEO changes completed!');
