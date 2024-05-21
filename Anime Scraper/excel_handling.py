import pandas as pd

def read_excel_file():
    return pd.read_excel("anime_info.xlsx")

def add_anime_info(dataframe, name, info):
    new_row = {'Name': name, **info}
    return dataframe._append(new_row, ignore_index=True)

def save_to_excel(dataframe):
    dataframe.to_excel("anime_info.xlsx", index=False)
