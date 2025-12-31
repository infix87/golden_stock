import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def fetch_news(code):
    """
    Fetches news for a specific stock code from Naver Finance.
    """
    url = f"https://finance.naver.com/item/news_news.naver?code={code}&page=1&sm=title_entity_id.basic&clusterId="
    # Referer is critical for accurate results
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        "Referer": f"https://finance.naver.com/item/main.naver?code={code}"
    }
    
    news_list = []
    
    try:
        res = requests.get(url, headers=headers, timeout=5)
        res.raise_for_status()
        # Naver Finance uses euc-kr
        soup = BeautifulSoup(res.content.decode('euc-kr', 'replace'), 'html.parser')
        
        # News titles are in 'a.tit'
        titles = soup.select('a.tit')
        
        for t in titles:
            title = t.get_text(strip=True)
            link = urljoin("https://finance.naver.com", t['href'])
            
            # Try to find date and source (info)
            # Structure: tr > td.title, td.info, td.date
            row = t.find_parent('tr')
            if row:
                source_tag = row.select_one('.info')
                date_tag = row.select_one('.date')
                
                source = source_tag.get_text(strip=True) if source_tag else "Naver Finance"
                pub_date = date_tag.get_text(strip=True) if date_tag else ""
                
                # Combine source and summary (since summary is minimal here)
                summary = f"{source} | {pub_date}"
            else:
                summary = ""
                pub_date = ""

            news_list.append({
                "title": title,
                "url": link,
                "summary": summary, 
                "published_at": pub_date
            })
            
    except Exception as e:
        print(f"Error fetching news for {code}: {e}")
        
    return news_list
