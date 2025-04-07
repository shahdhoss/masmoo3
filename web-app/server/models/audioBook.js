const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
    chapter_title: { type: String, required: true },
    audio_link: { type: String, required: true },
    episode_no: { type: Number, required: true },
    duration: { type: String, required: true },
});

const audioBookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    language: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    author_first_name: { type: String, required: false },
    author_last_name: { type: String, required: true },
    episodes: [episodeSchema], // Array of episodes
});

module.exports = mongoose.model("AudioBook", audioBookSchema);