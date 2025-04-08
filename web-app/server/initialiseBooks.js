const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const AudioBook = require("./models/audioBook.js");

// Directory containing parsed JSON files
const parsedDataDir = path.join(__dirname, "../../parsed_book_data");

// Function to insert JSON data into the AudioBook collection
const insertParsedData = async () => {
    try {
        const files = fs.readdirSync(parsedDataDir);

        for (const file of files) {
            console.log(`Processing data from ${file}`);
            if (path.extname(file) === ".json") {
                const filePath = path.join(parsedDataDir, file);
                const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

                // Skip if the audiobook already exists in the database
                if (await AudioBook.findOne({ id: jsonData.id })) {
                    continue;
                }

                // Remove "by" and everything after it from the title
                jsonData.title = jsonData.title.split(" by")[0].trim();

                // Check if the title ends with ", the" and adjust it
                if (jsonData.title.toLowerCase().endsWith(", the")) {
                    jsonData.title = `The ${jsonData.title.slice(0, -5).trim()}`; // Move "the" to the beginning
                }

                // Combine author_first_name and author_last_name into a single author field
                jsonData.author = `${jsonData.author_first_name} ${jsonData.author_last_name}`;
                delete jsonData.author_first_name; // Remove the original field
                delete jsonData.author_last_name; // Remove the original field

                // Insert data into the AudioBook collection
                await AudioBook.create(jsonData);
                console.log(`Inserted data from ${file}`);
            }
        }

        console.log("All JSON files have been processed and inserted.");
    } catch (err) {
        console.error("Error inserting data:", err);
    }
};

module.exports = insertParsedData;
