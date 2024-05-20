from bs4 import BeautifulSoup
import requests
from extract_info import extract_info, extract_other_info
import re

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
        "Demographic": demographic
    }