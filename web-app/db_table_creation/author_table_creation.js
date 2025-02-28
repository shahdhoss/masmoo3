const connection = require('./init_connection');
const client = connection;

const createtableauthor= `create table author(
    id int primary key,
    first_name varchar(255),
    last_name varchar(255),
    author_dob date,
    author_dod date)`
client.query(createtableauthor)
    .then(() => console.log("Table created successfully"))
    .catch(err => console.error("Error creating table", err.stack))
    .finally(() => client.end()); 