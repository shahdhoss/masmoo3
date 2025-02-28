import requests
import xmltodict
import json

with open("librivox\ids.json", "r") as file:
    ids_list = json.load(file)

for id in ids_list:

    response = requests.get(f"https://librivox.org/rss/{id}")
    data = xmltodict.parse(response.text)

    dict={}

    dict['title']= data ['rss']['channel']['title']
    dict['image'] = data['rss']['channel']["itunes:image"]['@href'] 
    dict['language'] = data['rss']['channel']['language']
    dict['category'] = data['rss']['channel']['itunes:category']["itunes:category"]['@text']

    episodes=[]
    data_dict={}
    if 'item' in data['rss']['channel']:
        for item in data['rss']['channel']['item']:
            data_dict['chapter_title']= item['title']
            data_dict['audio_link'] = item['enclosure']['@url']
            data_dict['episode_no']= item['itunes:episode']
            data_dict['duration'] = item['itunes:duration']
            episodes.append(data_dict)
            data_dict={}

    dict['episodes']= episodes
    with open(f"parsed_data\\id_{id}_parsed.json", "w") as file:
        json.dump(dict, file, indent=4)

