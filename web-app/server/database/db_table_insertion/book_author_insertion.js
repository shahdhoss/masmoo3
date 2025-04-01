const connection = require('../db_table_creation/init_connection')
const fs = require('fs')
const authorBookIds = JSON.parse(fs.readFileSync('./parsed_book_data/book_author_ids.json')) 

const insertBookAuthors = async ()=>{
    const client = connection
    try{ 
        for (let i=0;i<authorBookIds.length;i++){
    await client.query(`insert into book_author (book_id, author_id) values
    ($1,$2)`,[authorBookIds[i].book_id, authorBookIds[i].author_id])
        }
        console.log("id", authorBookIds[i].book_id)
    }
    catch(err){
        console.log("an error happened: ", err.stack)
    }
    finally{
        client.end()
    }
}
insertBookAuthors()