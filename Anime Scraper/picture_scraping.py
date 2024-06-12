import requests
from bs4 import BeautifulSoup
import time
import file_operations
import os

def save_image(image_url, filename):
    response = requests.get(image_url)
    if response.status_code == 200:
        with open(filename, 'wb') as file:
            file.write(response.content)
        print(f"Image saved as {filename}")
    else:
        print(f"Failed to retrieve image from {image_url}")

def main():
    while True:
        # Read values of num and index from the note file
        num, index = file_operations.read_note_file()

        # Fetch the initial page with the list of top anime
        page_to_scrape = requests.get(f"https://myanimelist.net/topanime.php?limit={num*50}")
        soup = BeautifulSoup(page_to_scrape.text, "html.parser")

        # Find all anime links
        anime_list = soup.find_all("a", attrs={"class": "hoverinfo_trigger"})

        for anime in anime_list[index - 1:]:
            if anime.has_attr("href") and index % 2 == 0:  # Check if index is divisible by 2
                anime_url = anime['href']
                print(f"Opening {anime.text}: {anime_url}")

                # Fetch the anime page
                anime_page = requests.get(anime_url)

                # Add a delay to ensure the page loads fully
                time.sleep(3)  # Delay for 3 seconds (adjust as needed)

                anime_soup = BeautifulSoup(anime_page.text, "html.parser")

                # Find the image URL
                image_tag = anime_soup.find("a", href=lambda href: href and "/pics" in href)
                if image_tag:
                    img_tag = image_tag.find("img")
                    if img_tag and img_tag.has_attr("data-src"):
                        image_url = img_tag["data-src"]
                        filename = f"{anime.text}.jpg".replace("/", "_")
                        save_image(image_url, filename)

                # Add a delay between requests
                time.sleep(2)  # Delay for 2 seconds (adjust as needed)

            # Update index
            index += 1

            # Write updated values of num and index to the note file after processing each anime
            file_operations.write_note_file(num, index)

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

if __name__ == "__main__":
    main()
