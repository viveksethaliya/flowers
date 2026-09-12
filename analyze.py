import glob
import re
from bs4 import BeautifulSoup

files = glob.glob('**/*.html', recursive=True)

print('--- PHONE NUMBERS ---')
phone_pattern = re.compile(r'\+91[-\s]*\d{5}[-\s]*\d{5}|\b\d{10}\b|\b\d{5}[-\s]*\d{5}\b')
for f in files:
    with open(f, 'r', encoding='latin1') as fp:
        content = fp.read()
    
    tels = re.findall(r'href=["\']tel:([^"\']+)["\']', content)
    for t in tels:
        print(f'{f}: {t} (in tel: href)')
    
    soup = BeautifulSoup(content, 'html.parser')
    text = soup.get_text()
    matches = phone_pattern.findall(text)
    for m in set(matches):
        print(f'{f}: {m} (in text)')

print('--- CURRENCY ---')
currency_pattern = re.compile(r'(\b\d+(?:,\d+)*(?:\.\d+)?\b\s*(?:INR|Rs\.?|₹|inr|rs|\$|USD|usd|eur|€|£|GBP))|((?:INR|Rs\.?|₹|inr|rs|\$|USD|usd|eur|€|£|GBP)\s*\b\d+(?:,\d+)*(?:\.\d+)?\b)')
for f in files:
    with open(f, 'r', encoding='latin1') as fp:
        content = fp.read()
    soup = BeautifulSoup(content, 'html.parser')
    text = soup.get_text()
    matches = currency_pattern.findall(text)
    if matches:
        print(f'{f}: {matches}')
        
print('--- FOOTER ---')
with open('index.html', 'r', encoding='latin1') as fp:
    soup = BeautifulSoup(fp.read(), 'html.parser')
    footer = soup.find('footer')
    if footer:
        print(footer.get_text().strip()[:200])
        
print('--- CONTACT DETAILS ---')
with open('contact.html', 'r', encoding='latin1') as fp:
    soup = BeautifulSoup(fp.read(), 'html.parser')
    print(soup.get_text())
