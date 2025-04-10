const { audiobooks } = require('../models'); 

exports.getAll = async (req, res) => {
    try {
        const audioBooks = await audiobooks.findAll({
            attributes: { exclude: ['episodes', '_id', '_v'] }, 
        });
        res.status(200).json(audioBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const audioBookData = await audiobooks.findOne({
            where: { id }, 
        });

        if (!audioBookData) {
            return res.status(404).json({ message: 'Audio book not found' });
        }

        res.status(200).json(audioBookData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.create = async (req, res) => {
    const {uploader_id, title, image, language, category ,description, author ,coverImage, episodes} = req.body;
    try {
        const newAudioBook = await audiobooks.create({
            uploader_id,
            title,
            image,
            language,
            category,
            description,
            author,
            coverImage,
            episodes
        });
        res.status(201).json(newAudioBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.delete = async(req,res)=>{
    try{
        const {id} = req.params;
        const book = await audiobooks.findOne({where: {id}});
        if (!book) {
            return res.status(404).json({message: 'Book not found'});
        }
        await audiobooks.destroy({where: {id}});
        res.status(200).json({message: 'Book deleted successfully'});
    }
    catch(error){
        console.error(error)
        res.status(500).json({message: 'Internal server error'});
    }
}