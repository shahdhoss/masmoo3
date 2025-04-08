const connection = require('./init_connection');
const client = connection;
const  createtablebook_chapter = `create table book_chapter (
    book_id int,
    episode_no int,
    episode_title varchar(255) not null,
    audio_link text not null,
    duration interval not null,
    primary key (book_id, episode_no),
    foreign key (book_id) references book(id) on delete cascade
)`


client.query(createtablebook_chapter).then(() => console.log("Table created successfully")).catch(err => console.error("Error creating table", err.stack)).finally(() => client.end()); 