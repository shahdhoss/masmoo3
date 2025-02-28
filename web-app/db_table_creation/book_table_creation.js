const connection = require('./init_connection');
const client = connection;
const createtablebook= `create table book(
    id int primary key,
    title varchar(255),
    language varchar(255),
    category varchar(255),
    description text,
    author_first_name varchar(255),
    author_last_name varchar(255)
)`

client.query(createtablebook)
    .then(() => console.log("Table created successfully"))
    .catch(err => console.error("Error creating table", err.stack))
    .finally(() => client.end()); 