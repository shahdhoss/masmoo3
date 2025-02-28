const connection = require('./init_connection');
const client = connection;
const  createtablebook_chapter = `create table book_chapter (
    book_id int,
    chapter_no int,
    chapter_name varchar(255),
    primary key (book_id, chapter_no),
    foreign key (book_id) references book(id) on delete cascade
)`


client.query(createtablebook_chapter).then(() => console.log("Table created successfully")).catch(err => console.error("Error creating table", err.stack)).finally(() => client.end()); 