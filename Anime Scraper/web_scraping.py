from bs4 import BeautifulSoup
import requests
import re

def extract_info(soup, label):
    # Function to extract the information from the table
    element = soup.find("span", string=label)
    if element and element.find_next_sibling():
        return element.find_next_sibling().text.strip()
    return ""

def extract_other_info(soup, label):
    # Function to extract other information like genres, studios, etc.
    element = soup.find("span", string=label)
    if element:
        return ', '.join([a.text for a in element.find_next_siblings("a")])
    return ""

def get_info(url):
    anime_page = requests.get(url)
    soup = BeautifulSoup(anime_page.text, "html.parser")
    
    # Extract various information
    score = soup.find("span", itemprop="ratingValue").text if soup.find("span", itemprop="ratingValue") else ""
    aired_info = extract_info(soup, "Aired:") if extract_info(soup, "Aired:") else ""
    match = re.search(r'\d{4}', aired_info)
    aired_year = match.group() if match else ""
    duration = extract_info(soup, "Duration:") if extract_info(soup, "Duration:") else ""
    episodes = extract_info(soup, "Episodes:") if extract_info(soup, "Episodes:") else ""
    rating = extract_info(soup, "Rating:") if extract_info(soup, "Rating:") else ""
    genres = extract_other_info(soup, 'Genres:') if extract_other_info(soup, 'Genres:') else ""
    theme = extract_other_info(soup, 'Theme:') if extract_other_info(soup, 'Theme:') else ""
    studios = extract_other_info(soup, 'Studios:') if extract_other_info(soup, 'Studios:') else ""
    demographic = extract_other_info(soup, "Demographic:") if extract_other_info(soup, "Demographic:") else ""

    # Extract alternative title
    alternative_title = soup.find("p", class_="title-english title-inherit")
    alternative_title_text = alternative_title.text.strip() if alternative_title else ""

    # Format duration
    if duration:
        duration = duration.split()[0]
    
    # Return the extracted information as a dictionary
    return {
        "Score": score,
        "Aired": aired_year,
        "Duration": duration,
        "Episodes": episodes,
        "Rating": rating,
        "Genres": genres,
        "Theme": theme,
        "Studios": studios,
        "Demographic": demographic,
        "Alternative Title": alternative_title_text
    }
