from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def get_anime_scores(url):
    # Set up Chrome options for headless mode
    options = Options()
    options.add_argument("--headless")  # Comment this line out if you want to see the browser window
    options.add_argument("--disable-gpu")  # Chrome bug workaround
    
    # Initialize WebDriver with Chrome options
    driver = webdriver.Chrome(options=options)  # Change to the appropriate WebDriver for your browser
    
    # Load the URL
    driver.get(url)
    
    # Wait for the links to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'a[href^="/anime/"]')))
    
    # Extract the links and their attached text
    anime_elements = driver.find_elements(By.CSS_SELECTOR, 'a[href^="/anime/"]')
    anime_scores = {}
    
    for anime_element in anime_elements:
        anime_name = anime_element.text.strip()
        
        # Locate the score element relative to the anime element
        score_element = anime_element.find_element(By.XPATH, "./ancestor::tr//span[contains(@class,'score-label')]")
        score_text = score_element.text.strip()
        
        # Try to convert the score to an integer
        try:
            score = int(score_text)
        except ValueError:
            score = ""  # If conversion fails, fill with blank
        
        # Exclude cases where anime name is empty
        if anime_name:
            anime_scores[anime_name] = score
    
    # Close the WebDriver
    driver.quit()
    
    return anime_scores
