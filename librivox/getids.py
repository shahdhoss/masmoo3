import requests
import xmltodict
import json
response = requests.get("https://librivox.org/api/feed/audiobooks")

data = xmltodict.parse(response.text)

print(data)
ids=[]
for hit in data['xml']['books']['book']:
    ids.append(hit['id'])

# with open("librivox\\data.json" , "w") as file:
#     json.dump(data,file, indent=4)

with open("librivox\\ids.json" , "w") as file:
    json.dump(ids,file, indent=4)
print(data)