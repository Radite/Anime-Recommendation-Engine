import requests
from bs4 import BeautifulSoup
from ScrapeProfile import scrape_profile 
import openpyxl
import os
import time

def get_state():
    state_file = "scraping_state.txt"
    if os.path.exists(state_file):
        with open(state_file, "r") as file:
            state = file.read().split(',')
        return int(state[0]), int(state[1]), int(state[2]), int(state[3]), int(state[4]), int(state[5]), int(state[6])
    else:
        # If state file doesn't exist, return default values
        return 0, 2, 0, 35, 44, 3, 150

def save_state(page_number, gender, total_count, min_age, max_age, age_index, m):
    state_file = "scraping_state.txt"
    with open(state_file, "w") as file:
        file.write(f"{page_number},{gender},{total_count},{min_age},{max_age},{age_index},{m}")

def scrape_profiles():
    age_ranges = [
        (13, 17, 1000),
        (18, 24, 1500),
        (25, 34, 1000),
        (35, 44, 750),
        (45, 54, 500),
        (55, 64, 250),
        (65, 100, 250)
    ]

    page_number, gender, total_count, min_age, max_age, age_index, m = get_state()
    info_count = 0
    profiles_data = []

    while True:
        if total_count >= m:
            gender = 1 if gender == 2 else 2
            total_count = 0
            page_number = 0  # Reset page_number to 0 when gender changes

            if gender == 1:  # Both genders have been scraped for the current age range
                age_index += 1
                if age_index >= len(age_ranges):
                    break  # All age ranges have been scraped

                min_age, max_age, m = age_ranges[age_index]

        page_url = f"https://myanimelist.net/users.php?cat=user&q=&loc=&agelow={min_age}&agehigh={max_age}&g={gender}&show={page_number}"
        page_to_scrape = requests.get(page_url)
        soup = BeautifulSoup(page_to_scrape.text, "html.parser")

        pic_surrounds = soup.find_all('div', class_='picSurround')
        profile_links = [f"https://myanimelist.net{pic.find('a')['href']}" for pic in pic_surrounds if pic.find('a')]

        for index, link in enumerate(profile_links):
            # Skip profiles until we reach the correct info count
            if index < info_count:
                continue

            anime_scores = scrape_profile(link)
            profile_data = {
                'profile_url': link,
                'anime_scores': anime_scores,
                'min_age': min_age,
                'gender': gender
            }
            # Add data to profiles_data only if anime_scores is not empty
            if anime_scores:
                profiles_data.append(profile_data)
                total_count += 1
                print(profile_data)  # Print the profile data when added

                # Save each profile's data to Excel immediately
                save_to_excel([profile_data])

                # Update state in the notepad
                save_state(page_number, gender, total_count, min_age, max_age, age_index, m)

            info_count += 1
            if info_count == 24:
                info_count = 0
                page_number += 24  # Increase page number by 24
                break  # Exit the inner loop to reset info_count

            # Add a delay after each profile scrape to avoid being blocked
            time.sleep(3)  # Adjust the delay time as needed

        # Update state in the notepad after each page scrape
        save_state(page_number, gender, total_count, min_age, max_age, age_index, m)

    return profiles_data

# Function to save profiles data to Excel
def save_to_excel(profiles_data):
    if not profiles_data:
        return

    file_name = 'profiles_data.xlsx'
    
    # Load existing workbook or create a new one
    if os.path.exists(file_name):
        wb = openpyxl.load_workbook(file_name)
    else:
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(['Profile URL', 'Anime Scores', 'Min Age', 'Gender'])

    ws = wb.active

    # Add data
    for profile in profiles_data:
        ws.append([profile['profile_url'], str(profile['anime_scores']), profile['min_age'], profile['gender']])

    # Save the workbook
    wb.save(file_name)

# Start the scraping process
scrape_profiles()
