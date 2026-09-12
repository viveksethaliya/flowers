import glob
import re
import sys
import os

# ─────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────

ADDRESS_BLOCK = (
    '        <address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress"\r\n'
    '            style="font-style:normal;font-size:0.85rem;opacity:0.7;margin-top:0.5rem;">\r\n'
    '            <span itemprop="addressLocality">Vadodara</span>,\r\n'
    '            <span itemprop="addressRegion">Gujarat</span>,\r\n'
    '            <span itemprop="addressCountry">India</span>\r\n'
    '            &nbsp;&middot;&nbsp;\r\n'
    '            <a href="tel:+919316602536" itemprop="telephone">+91 93166 02536</a>\r\n'
    '        </address>\r\n'
)

LOCAL_BUSINESS_INDEX = """{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.fleurvine.in/#organization",
  "name": "Fleur Vine",
  "url": "https://www.fleurvine.in",
  "logo": "https://www.fleurvine.in/fvc/logo.webp",
  "image": "https://www.fleurvine.in/media/logo.webp",
  "description": "Wholesale bulk flower supplier in India for weddings, events, decorators and floral installations.",
  "serviceType": "Wholesale Bulk Flower Supply",
  "telephone": "+919316602536",
  "email": "fleurvine@outlook.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Vadodara",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "09:00",
      "closes": "19:00"
    }
  ],
  "sameAs": ["https://www.instagram.com/fleurvine.in/"],
  "areaServed": {
    "@type": "Country",
    "name": "India"
  }
}"""

LOCAL_BUSINESS_CONTACT = """{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.fleurvine.in/#organization",
  "name": "Fleur Vine",
  "url": "https://www.fleurvine.in",
  "logo": "https://www.fleurvine.in/media/logo.webp",
  "description": "Farm-direct bulk wholesale fresh flower supply for event planners, decorators, and exporters across India.",
  "telephone": "+919316602536",
  "email": "fleurvine@outlook.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Vadodara",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      "opens": "09:00",
      "closes": "19:00"
    }
  ]
}"""

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def read_file(path):
    with open(path, 'rb') as f:
        raw = f.read()
    has_bom = raw.startswith(b'\xef\xbb\xbf')
    if has_bom:
        text = raw.decode('utf-8-sig')
        enc = 'utf-8-sig'
    else:
        text = raw.decode('latin1')
        enc = 'latin1'
    return text, enc, has_bom

def write_file(path, text, enc):
    raw = text.encode(enc)
    with open(path, 'wb') as f:
        f.write(raw)

def verify_file(path, enc):
    with open(path, 'rb') as f:
        raw = f.read()
    if enc == 'utf-8-sig':
        assert raw.startswith(b'\xef\xbb\xbf'), f"ABORT: BOM stripped on {path}"
        return raw[3:].decode('utf-8')
    else:
        return raw.decode('latin1')

# ─────────────────────────────────────────────
# TRANSFORMS
# ─────────────────────────────────────────────

def apply_lang(text):
    """Change lang="en" to lang="en-IN" on <html> tag."""
    return re.sub(r'<html\s+lang=["\']en["\']', '<html lang="en-IN"', text)

def apply_hreflang(text):
    """Insert hreflang tags immediately after <link rel="canonical" ...>."""
    def insert_hreflang(m):
        full_tag = m.group(0)
        canonical_url = m.group(1)
        hreflang = (
            f'\n    <link rel="alternate" hreflang="en-IN" href="{canonical_url}">'
            f'\n    <link rel="alternate" hreflang="x-default" href="{canonical_url}">'
        )
        return full_tag + hreflang
    return re.sub(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']>', insert_hreflang, text)

def apply_phone_format(text):
    """Fix display text of tel: links from +91 9316602536 to +91 93166 02536."""
    return re.sub(
        r'(<a\s+href=["\']tel:\+919316602536["\'][^>]*>)\+91\s*9316602536(<\/a>)',
        r'\g<1>+91 93166 02536\2',
        text
    )

def apply_footer_address(text):
    """Inject address block inside footer-bottom div, after the last </p> before </div>."""
    # Find the footer-bottom div and insert address before its closing </div>
    def inject_address(m):
        footer_inner = m.group(0)
        # Check if address block already injected
        if 'itemprop="address"' in footer_inner:
            return footer_inner
        # Insert before the closing </div> of footer-bottom
        return re.sub(
            r'((?:<p>[^<]*</p>\s*)+)(</div>)',
            r'\1' + ADDRESS_BLOCK + r'\2',
            footer_inner,
            count=1
        )
    return re.sub(
        r'<div class=["\']footer-bottom["\']>.*?</div>',
        inject_address,
        text,
        flags=re.DOTALL
    )

def apply_index_jsonld(text):
    """Replace Organization JSON-LD with LocalBusiness in index.html."""
    new_block = f'<script type="application/ld+json">\n    {LOCAL_BUSINESS_INDEX}\n    </script>'
    result = re.sub(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>\s*\{[^}]*"@type"\s*:\s*"Organization"[\s\S]*?</script>',
        new_block,
        text,
        count=1
    )
    if result == text:
        print("  WARNING: Organization block not found in index.html — pattern may not have matched")
    return result

def apply_contact_jsonld(text):
    """Add LocalBusiness JSON-LD before </head> in contact.html."""
    new_block = f'\n    <script type="application/ld+json">\n    {LOCAL_BUSINESS_CONTACT}\n    </script>\n'
    return text.replace('</head>', new_block + '</head>', 1)

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

files = glob.glob('**/*.html', recursive=True)
files = [f.replace('\\', '/') for f in files]

errors = []

for f in sorted(files):
    print(f"Processing: {f}")
    text, enc, has_bom = read_file(f)

    original = text

    # 1. lang="en-IN"
    text = apply_lang(text)

    # 2. hreflang
    text = apply_hreflang(text)

    # 3. Phone display text
    text = apply_phone_format(text)

    # 4. Footer address
    text = apply_footer_address(text)

    # 5. File-specific JSON-LD
    if f == 'index.html':
        text = apply_index_jsonld(text)
    elif f == 'contact.html':
        text = apply_contact_jsonld(text)

    if text == original:
        print(f"  (no changes)")
        continue

    # Write
    write_file(f, text, enc)

    # Verify — re-read and check BOM is intact
    verified = verify_file(f, enc)
    print(f"  Written OK (enc={enc}, bom={has_bom})")

print("\n=== ALL DONE ===")
if errors:
    print("ERRORS:")
    for e in errors:
        print(" ", e)
    sys.exit(1)
else:
    print("No errors.")
