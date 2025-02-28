import json
import requests
with open("internet-archive/olid.json",'r') as file:
    data = json.load(file)


metadata_list = []
count = 0	
for hit in data:
    count+=1
    if count == 10:
        break
    response = requests.get(f"https://archive.org/metadata/{hit}",timeout=10)
    if response.status_code == 200:  
        metadata_list.append(response.json())
    else:
        print(f"Failed to fetch metadata for {hit}") 

with open("data_fetching\internet-archive\metadata.json", "w") as file:
    json.dump(metadata_list, file, indent=4)
    
    