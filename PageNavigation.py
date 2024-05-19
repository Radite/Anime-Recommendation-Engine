import webbrowser
from bs4 import BeautifulSoup
import requests
import GetPageInfo

# Fetch the initial page with the list of top anime
page_to_scrape = requests.get("https://myanimelist.net/topanime.php?limit=0")
soup = BeautifulSoup(page_to_scrape.text, "html.parser")

# Find all anime links
anime_list = soup.find_all("a", attrs={"class": "hoverinfo_trigger"})

anime_info = {}
# Loop through the anime list and open every second link in the browser
for index, anime in enumerate(anime_list, start=1):
    if anime.has_attr("href") and index % 2 == 0:
        anime_url = anime['href']
        print(f"Opening {anime.text}: {anime_url}")
        anime_info[anime.text] = GetPageInfo.get_info(anime_url) 
        print(anime_info)

# Print or process the collected anime information
print(anime_info)
