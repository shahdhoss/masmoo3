const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const AudioBook = require("./models/audioBook.js");

// MongoDB connection
// mongoose.connect("mongodb://localhost:27017/masmoo3", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.error("MongoDB connection error:", err));

// Directory containing parsed JSON files
const parsedDataDir = "E:/alhusseain/masmoo3/masmoo3/parsed_book_data";

// Function to insert JSON data into the AudioBook collection
const insertParsedData = async () => {
    try {
        const files = fs.readdirSync(parsedDataDir);

        for (const file of files) {
            console.log(`Inserting data from ${file}`);
            if (path.extname(file) === ".json") {
                const filePath = path.join(parsedDataDir, file);
                const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                if (await AudioBook.findOne({id:jsonData.id})) {continue};

                // Insert data into the AudioBook collection
                await AudioBook.create(jsonData);
                console.log(`Inserted data from ${file}`);
            }
        }

        console.log("All JSON files have been inserted.");
    } catch (err) {
        console.error("Error inserting data:", err);
    } finally {
        mongoose.connection.close();
    }
};


module.exports = insertParsedData;
