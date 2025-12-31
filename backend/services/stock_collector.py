import requests
from bs4 import BeautifulSoup
import re

def fetch_golden_cross_stocks():
    url = "https://finance.naver.com/sise/item_gold.naver"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
    }
    try:
        res = requests.get(url, headers=headers, timeout=5)
        res.raise_for_status()
        # Encoder adjustment for Korean
        soup = BeautifulSoup(res.content.decode('euc-kr', 'replace'), 'html.parser')
        
        stocks = []
        # The table class is 'type_5'
        table = soup.find('table', class_='type_5')
        if not table:
            return []

        # Rows are in 'tr'
        rows = table.find_all('tr')
        for row in rows:
            # Check if it's a valid data row (has columns with data)
            cols = row.find_all('td')
            if len(cols) < 2:
                continue
            
            # Name and Code is usually in the second column (index 1) inside an 'a' tag
            name_col = cols[1].find('a')
            if name_col:
                name = name_col.text.strip()
                href = name_col['href']
                # href format: /item/main.naver?code=005930
                code_match = re.search(r'code=(\d+)', href)
                code = code_match.group(1) if code_match else "000000"
                
                # Current Price is usually next
                price = cols[2].text.strip()
                
                stocks.append({
                    "name": name,
                    "code": code,
                    "price": price
                })
        
        return stocks

    except Exception as e:
        print(f"Error fetching golden cross stocks: {e}")
        return []

if __name__ == "__main__":
    # Test run
    print(fetch_golden_cross_stocks())
