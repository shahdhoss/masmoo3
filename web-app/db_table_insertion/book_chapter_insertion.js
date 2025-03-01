const connection = require('../db_table_creation/init_connection')
const fs = require('fs')

const bookids = JSON.parse(fs.readFileSync('./data_fetching/librivox/ids.json', 'utf8'));
const insertBookChapters = async () => {
    const client = connection; 
    try {
      for (let i = 0; i < bookids.length; i++) {
        const book = JSON.parse(fs.readFileSync(`./parsed_book_data/id_${bookids[i]}_parsed.json`, 'utf8'));
        for ( let j = 0 ; j< book.episodes.length; j++){
            const insertbookchapter = `insert into book_chapter 
        (book_id, episode_no, episode_title,audio_link, duration) 
        values ($1, $2, $3, $4, $5)`;
            await client.query(insertbookchapter, [book.id, book.episodes[j].episode_no, book.episodes[j].chapter_title, book.episodes[j].audio_link, 
            book.episodes[j].duration]);
    }
      }
      console.log("All books inserted successfully");
    } catch (err) {
      console.error("Error inserting into table:", err.stack);
    } finally {
      client.end(); 
    }
  };

insertBookChapters()