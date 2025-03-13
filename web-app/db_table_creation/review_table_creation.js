const connection = require('./init_connection');
const client = connection;
const createTableReviews = `create table reviews (id serial primary key,
    created_at timestamptz,
    review_text varchar(255),
    rating float,
    likes_count int,
    dislikes_count int,
    book_id int,
    user_id int,
    foreign key (book_id) references book(id) on delete cascade,
    foreign key (user_id) references users(id) on delete cascade)`

client.query(createTableReviews).then(() => console.log("Table created successfully")).catch(err => console.error("Error creating table", err.stack)).finally(() => client.end())