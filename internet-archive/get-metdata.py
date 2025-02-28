import json
with open("audiobook.json",'r') as file:
    data = json.load(file)


with open("olid.json", "w") as file:
    json.dump([hit.get('author_key', [''])[0] for hit in data['docs']], file, indent=4)
