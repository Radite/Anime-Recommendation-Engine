from bs4 import BeautifulSoup

def extract_info(soup, label):
    span = soup.find("span", class_="dark_text", text=label)
    if span:
        next_element = span.find_next_sibling(text=True)
        if next_element:
            return next_element.strip()
        elif span.find_next_sibling("a"):
            return span.find_next_sibling("a").text.strip()
    return None

def extract_other_info(soup, label):
    span = soup.find('span', class_='dark_text', text=label)
    if span:
        info = [sibling.text.strip() for sibling in span.find_next_siblings() if sibling.name == 'a']
        return info
    return None
