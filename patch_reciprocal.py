import re

SLUG = "wedding-flower-budget-guide-india-2026"
CANONICAL = f"https://www.fleurvine.in/blog/{SLUG}"
TODAY = "2026-09-13"

NEW_CARD = (
    '            <!-- Budget Guide Article -->\n'
    '            <a href="/blog/wedding-flower-budget-guide-india-2026" class="blog-card">\n'
    '                <div style="overflow: hidden;">\n'
    '                    <img src="/blog/img/wedding-flower-cost-india-bulk-market.webp"\n'
    '                        alt="Bulk wedding flowers at an Indian wholesale flower market"\n'
    '                        class="blog-img" width="1920" height="1280">\n'
    '                </div>\n'
    '                <div class="blog-content">\n'
    '                    <span class="blog-tag">Business &amp; Budgeting</span>\n'
    '                    <h3>How to Budget Wedding Flowers in India When Bulk Prices Change Every Day</h3>\n'
    '                    <p>A practical budgeting framework for decorators: what drives bulk flower prices, how to\n'
    '                        build a quote that holds, and how to lock rates before peak season.</p>\n'
    '                    <div class="blog-meta">\n'
    '                        <span>By Fleur Vine Team</span>\n'
    '                        <span>Sep 13, 2026</span>\n'
    '                    </div>\n'
    '                </div>\n'
    '            </a>\n'
)

# ── 1. blog/index.html ──────────────────────────────────────────────────────

with open("blog/index.html", "rb") as f:
    raw = f.read()
text = raw.decode("latin1")

# Insert new card as first item inside blog-grid, before current first card
INSERT_AFTER = '<div class="blog-grid">\n'
if NEW_CARD.strip() not in text:
    text = text.replace(INSERT_AFTER, INSERT_AFTER + NEW_CARD, 1)
    # Update CollectionPage JSON-LD to include new post at position 1 (shift others)
    # Find the itemListElement array and prepend a new item
    new_item = ('          {\n'
                '            "@type": "ListItem",\n'
                '            "position": 1,\n'
                f'            "url": "{CANONICAL}"\n'
                '          },\n')
    # Renumber existing items by 1
    def renumber_list_items(m):
        items = m.group(0)
        def bump(nm):
            pos = int(nm.group(1))
            return f'"position": {pos + 1}'
        return re.sub(r'"position": (\d+)', bump, items)
    text = re.sub(
        r'"itemListElement":\s*\[(.*?)\]',
        lambda m: '"itemListElement": [\n' + new_item + re.sub(r'"position": (\d+)', lambda n: f'"position": {int(n.group(1)) + 1}', m.group(1)) + '        ]',
        text,
        flags=re.DOTALL,
        count=1
    )

with open("blog/index.html", "wb") as f:
    f.write(text.encode("latin1"))
print("blog/index.html: updated")

# ── 2. blog/ultimate-wedding-flower-calculator.html ─────────────────────────

with open("blog/ultimate-wedding-flower-calculator.html", "rb") as f:
    raw = f.read()
text = raw.decode("latin1")

LINK_BLOCK = ('\n            <p>Before you can plan budget allocations, you need accurate stem counts. Once you have those, '
              'read our <a href="/blog/wedding-flower-budget-guide-india-2026" style="color:var(--forest);font-weight:bold;">'
              'complete guide to budgeting wedding flowers in India</a> to understand how to structure a quote '
              'that holds when market rates move.</p>')

# Insert after the first <h2> in post-content
if "wedding-flower-budget-guide-india-2026" not in text:
    text = re.sub(
        r'(class="post-content">\s*<p>)',
        r'\1',
        text
    )
    # Add after the first closing </h2> inside post-content
    text = re.sub(
        r'(class="post-content"[\s\S]{0,200}?</h2>)',
        r'\1' + LINK_BLOCK,
        text,
        count=1
    )

with open("blog/ultimate-wedding-flower-calculator.html", "wb") as f:
    f.write(text.encode("latin1"))
print("blog/ultimate-wedding-flower-calculator.html: updated")

# ── 3. blog/estimating-flower-stems-weddings.html ───────────────────────────

with open("blog/estimating-flower-stems-weddings.html", "rb") as f:
    raw = f.read()
text = raw.decode("latin1")

LINK_BLOCK2 = ('\n            <p>Accurate stem counts are only half the picture. Once you have your quantities, '
               'our <a href="/blog/wedding-flower-budget-guide-india-2026" style="color:var(--forest);font-weight:bold;">'
               'wedding flower budget guide for India</a> explains how to structure a quote around those numbers '
               'so it survives daily price movement.</p>')

if "wedding-flower-budget-guide-india-2026" not in text:
    text = re.sub(
        r'(class="post-content"[\s\S]{0,200}?</h2>)',
        r'\1' + LINK_BLOCK2,
        text,
        count=1
    )

with open("blog/estimating-flower-stems-weddings.html", "wb") as f:
    f.write(text.encode("latin1"))
print("blog/estimating-flower-stems-weddings.html: updated")

# ── 4. sitemap.xml ──────────────────────────────────────────────────────────

with open("sitemap.xml", "r", encoding="utf-8") as f:
    sitemap = f.read()

NEW_LOC = (
    f'\n    <url>\n'
    f'        <loc>https://www.fleurvine.in/blog/{SLUG}</loc>\n'
    f'        <lastmod>{TODAY}</lastmod>\n'
    f'        <changefreq>monthly</changefreq>\n'
    f'        <priority>0.8</priority>\n'
    f'    </url>'
)

if SLUG not in sitemap:
    sitemap = sitemap.replace("</urlset>", NEW_LOC + "\n</urlset>")

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap)
print("sitemap.xml: updated")

print("\nAll done.")
