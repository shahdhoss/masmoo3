const connection = require('../db_table_creation/init_connection')
const fs = require("fs")

authorids=[]
const authorData = JSON.parse(fs.readFileSync('./parsed_book_data/book_author_ids.json')) 
const insertAuthors = async()=>{
    const client = connection
    try{
        for(let i=0;i<authorData.length;i++){
            if(!authorids.includes(authorData[i].author_id)){
                authorids.push(authorData[i].author_id)
                const insertAuthor= `insert into author(id, first_name, last_name, author_dob, author_dod) values
            ($1,$2,$3,$4,$5)`
            console.log("author id: ", authorData[i].author_id)
            await client.query(insertAuthor,[authorData[i].author_id, authorData[i].author_first_name, authorData[i].author_last_name, authorData[i].author_dob, authorData[i].author_dod])
        }
    }
        console.log("All authors have been inserted")
    }
    catch(err){
        console.log("error happened", err.stack)
    }
    finally{
        client.end()
    }
}

insertAuthors()