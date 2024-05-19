from bs4 import BeautifulSoup
import requests
from extract_info import extract_info, extract_other_info

def get_info(url):
    anime_page = requests.get(url)
    soup = BeautifulSoup(anime_page.text, "html.parser")
    
    # Extract various information
    score = soup.find("span", itemprop="ratingValue").text
    aired = extract_info(soup, "Aired:")
    duration = extract_info(soup, "Duration:")
    episodes = extract_info(soup, "Episodes:")
    rating = extract_info(soup, "Rating:")
    genres = extract_other_info(soup, 'Genres:')
    theme = extract_other_info(soup, 'Theme:')
    studios = extract_other_info(soup, 'Studios:')
    demographic = extract_other_info(soup, "Demographic:")
    
    # Return the extracted information as a dictionary
    return {
        "Score": score,
        "Aired": aired,
        "Duration": duration,
        "Episodes": episodes,
        "Rating": rating,
        "Genres": genres,
        "Theme": theme,
        "Studios": studios,
        "Demographic": demographic
    }
