const connection = require('../db_table_creation/init_connection');
const fs = require('fs');

const bookids = JSON.parse(fs.readFileSync('./data_fetching/librivox/ids.json', 'utf8'));
const insertBooks = async () => {
    const client = connection; 
    try {
      for (let i = 0; i < bookids.length; i++) {
        const book = JSON.parse(fs.readFileSync(`./parsed_book_data/id_${bookids[i]}_parsed.json`, 'utf8'));
  
        const insertbook = `insert into book 
        (id, title, image, language, category, description, author_first_name, author_last_name) 
        values ($1, $2, $3, $4, $5, $6, $7, $8)`;
  
        console.log(book.id, book.title, book.image, book.language, book.category, book.description, book.author_first_name, book.author_last_name);
  
        await client.query(insertbook, [book.id, book.title, book.image, book.language, book.category, book.description, book.author_first_name, 
          book.author_last_name]);
      }
      console.log("All books inserted successfully");
    } catch (err) {
      console.error("Error inserting into table:", err.stack);
    } finally {
      client.end(); 
    }
  };

insertBooks()