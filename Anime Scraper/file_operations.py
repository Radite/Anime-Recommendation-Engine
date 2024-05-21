import os
import pandas as pd
def read_note_file():
    if os.path.exists("note.txt"):
        with open("note.txt", "r") as file:
            lines = file.readlines()
            num = int(lines[0].strip())
            index = int(lines[1].strip())
    else:
        num = 0
        index = 1
        write_note_file(num, index)  # Create note.txt with default values
    return num, index

def write_note_file(num, index):
    with open("note.txt", "w") as file:
        file.write(f"{num}\n")
        file.write(f"{index}\n")

def check_excel_file():
    return os.path.exists("anime_info.xlsx")

def create_excel_file():
    if not check_excel_file():
        anime_df = pd.DataFrame(columns=['Name', 'Score', 'Aired', 'Duration', 'Episodes', 'Rating', 'Genres', 'Theme', 'Studios', 'Demographic'])
        anime_df.to_excel("anime_info.xlsx", index=False)
