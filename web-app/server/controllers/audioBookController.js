const audioBook = require('../models/audioBook');

exports.getAll = async (req, res) => {
    try {
        const audioBooks = await audioBook.find().select('-episodes -_id -_v');
        res.status(200).json(audioBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const audioBookData = await audioBook.findOne({ id: id });
        if (!audioBookData) {
            return res.status(404).json({ message: 'Audio book not found' });
        }
        res.status(200).json(audioBookData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}