 const connection = require('./init_connection');
 const client = connection;
 const createtableFavoritedBooks= `create table favorited_books(
    book_id int,
    user_id int,
    foreign key (book_id) references book(id) on delete cascade,
    foreign key (user_id) references users(id) on delete cascade,
    primary key(book_id, user_id)
 )`
 
 client.query(createtableFavoritedBooks)
     .then(() => console.log("Table created successfully"))
     .catch(err => console.error("Error creating table", err.stack))
     .finally(() => client.end()); 