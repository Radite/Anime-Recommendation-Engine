import requests
from bs4 import BeautifulSoup
from GetAnimeScores import get_anime_scores

def scrape_profile(url):
    # Send a request to get the profile page content
    profile_response = requests.get(url)
    
    # Check if the request was successful
    if profile_response.status_code == 200:
        # Parse the profile page content
        profile_soup = BeautifulSoup(profile_response.text, 'html.parser')
        
        # Find the element containing the completed anime count
        completed_count = profile_soup.find('a', class_="di-ib fl-l lh10 circle anime completed")
        
        # Check if completed anime count element is found
        if completed_count:
            # Get the href attached to the completed count
            completed_href = completed_count.get('href')
            
            # Check if the count is greater than 0
            count_span = completed_count.find_next_sibling('span', class_='di-ib fl-r lh10')
            if count_span:
                count = int(count_span.text.strip())
                if count > 0:
                    print("Anime Completed Count:", count)
                    
                    # Get the responses from the link attached to completed count
                    if completed_href:
                        completed_list_response = requests.get(completed_href)
                        
                        # Check if the request for the completed list was successful
                        if completed_list_response.status_code == 200:
                            completed_list_soup = BeautifulSoup(completed_list_response.text, 'html.parser')
                            # Call get_anime_scores function to get anime scores from the completed list URL
                            anime_scores = get_anime_scores(completed_href)
                            return anime_scores
                        else:
                            print("Failed to retrieve completed list page.")
                    else:
                        print("Completed count link not found.")
                else:
                    print("No anime completed.")
            else:
                print("Completed count span not found.")
        else:
            print("Completed count element not found.")
    else:
        print("Failed to retrieve the profile page.")
