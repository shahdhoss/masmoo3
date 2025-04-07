const audioBook = require('../models/audioBook');

exports.getAll = async (req, res) => {
    try {
        const audioBooks = await audioBook.find();
        res.status(200).json(audioBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getByKeywords = async (req, res) => {
    try {
        const { title, author_first_name, author_last_name, language, category } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (author_first_name) {
            query.author_first_name = { $regex: author_first_name, $options: 'i' };
        }
        if (author_last_name) {
            query.author_last_name = { $regex: author_last_name, $options: 'i' };
        }
        if (language) {
            query.language = { $regex: language, $options: 'i' };
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const audioBooks = await audioBook.find(query);
        res.status(200).json(audioBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}