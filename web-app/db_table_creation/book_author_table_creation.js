const connection = require('./init_connection');
const client = connection;
const createtablebookauthor = `CREATE TABLE book_author (
    book_id int,
    author_id int,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES author(id) ON DELETE CASCADE
)`

client.query(createtablebookauthor).then(() => console.log("Table created successfully")).catch(err => console.error("Error creating table", err.stack)).finally(() => client.end())