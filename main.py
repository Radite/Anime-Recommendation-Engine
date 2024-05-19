import requests
from bs4 import BeautifulSoup
import file_operations
import web_scraping
import excel_handling

while True:
    # Read values of num and index from the note file
    num, index = file_operations.read_note_file()

    # Create Excel file if it doesn't exist
    file_operations.create_excel_file()

    # Check if the Excel file exists
    anime_data = excel_handling.read_excel_file()

    # Fetch the initial page with the list of top anime
    page_to_scrape = requests.get(f"https://myanimelist.net/topanime.php?limit={num*50}")
    soup = BeautifulSoup(page_to_scrape.text, "html.parser")

    # Find all anime links
    anime_list = soup.find_all("a", attrs={"class": "hoverinfo_trigger"})

    for anime in anime_list[index - 1:]:
        if anime.has_attr("href") and index % 2 == 0:  # Check if index is divisible by 2
            anime_url = anime['href']
            print(f"Opening {anime.text}: {anime_url}")
            anime_info = web_scraping.get_info(anime_url)
            print(anime_info)
            
            # Add anime info to DataFrame
            anime_data = excel_handling.add_anime_info(anime_data, anime.text, anime_info)

            # Save DataFrame to Excel file
            excel_handling.save_to_excel(anime_data)

            # Write updated values of num and index to the note file after each URL
            file_operations.write_note_file(num, index)

        # Update index
        index += 1

        # Check if index reaches 100
        if index > 100:
            num += 1  # Increment num by 1
            index = 1  # Reset index to 1

            # Write updated values of num and index to the note file after each num change
            file_operations.write_note_file(num, index)

            # Check if num reaches 201, if so, break out of the loop
            if num == 201:
                break

    # If num reaches 201, break out of the loop
    if num == 201:
        break

# Update values of num and index in the note file after each run
file_operations.write_note_file(num, index)
