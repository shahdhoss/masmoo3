import json
import requests
import xmltodict
response = requests.get("https://librivox.org/api/feed/audiobooks")
getinfo = xmltodict.parse(response.text)

book_author_ids=[]
for hit in getinfo['xml']['books']['book']:
    temp_dict={}
    temp_dict['book_id']=hit['id']
    authors = hit['authors']['author']
    if isinstance(authors, list):
        temp_dict['author_id'] = [author['id'] for author in authors]
        temp_dict['author_name'] = [f"{(author.get('first_name') or '').strip()} {(author.get('last_name') or '').strip()}" for author in authors]
        temp_dict['author_dob'] = [author.get('dob', '') for author in authors]
        temp_dict['author_dod'] = [author.get('dod', '') for author in authors]
    else:
        temp_dict['author_id'] = authors['id']
        temp_dict['author_first_name'] = authors.get('first_name', '')
        temp_dict['author_last_name'] = authors.get('last_name', '')
        temp_dict['author_dob'] = authors.get('dob', '')
        temp_dict['author_dod'] = authors.get('dod', '')

    book_author_ids.append(temp_dict)

with open("parsed_book_data\book_author_ids.json" , "w") as file:
    json.dump(book_author_ids,file, indent=4)

