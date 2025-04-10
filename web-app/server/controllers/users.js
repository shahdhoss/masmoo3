const {users, audiobooks} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
dotenv.config();

exports.createUser = async (req, res) => {
    try{
        const {first_name, last_name, email, password, role} = req.body;
        const existingUser = await users.findOne({where: {email}});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        const newUser = await users.create({
            first_name,
            last_name,
            email,
            password : await bcrypt.hash(password, 10),
            role
        });
        res.status(201).json(newUser);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, "sherlock_holmes", { expiresIn: '1h' });
        return res.status(200).json({ token , user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUser = async (req, res) => {
    try{
        const user = await users.findOne({where: {id: req.user.id}});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.updateUser = async (req, res) =>{
    try{
        const {first_name, last_name, bio, profile_pic} = req.body;
        const user = await users.findOne({where: {id: req.user.id}});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        await users.update({
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            bio: bio || user.bio,
            profile_pic: profile_pic || user.profile_pic,
            password: req.body.password || user.password,
        }, {where: {id: req.user.id}});
        res.status(200).json({message: 'User updated successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}
  

exports.getBooksByUser = async (req, res) => {
    try{
        const user = await users.findOne({where: {id: req.user.id}});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const books = await audiobooks.findAll({where: {uploader_id: user.id}});
        res.status(200).json(books);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.getNumberOfAddedBooks = async(req,res) =>{
    try{
        const user = await users.findOne({where: {id: req.user.id}});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const books = await audiobooks.findAll({where: {uploader_id: user.id}});
        res.status(200).json({numberOfBooks: books.length});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: 'Internal server error'});
    }
}