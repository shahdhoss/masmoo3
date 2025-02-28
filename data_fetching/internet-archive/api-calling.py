import requests 
import json

response = requests.get("https://openlibrary.org/search.json?q=audiobook")


with open ("data_fetching\internet-archive\audiobook.json", "w") as file:
    json.dump(response.json(), file)