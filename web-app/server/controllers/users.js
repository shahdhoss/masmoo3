const {users} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

exports.createUser = async (req, res) => {
    try{
        const {first_name, last_name, email, password} = req.body;
        const existingUser = await users.findOne({where: {email}});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        const newUser = await users.create({
            first_name,
            last_name,
            email,
            password : await bcrypt.hash(password, 10),
        });
        res.status(201).json(newUser);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.loginUser = async (req, res) => {
    try{
        const {email,password} = req.body;
        const user = await users.findOne({where: {email}});
        if (!user) {
            return res.status(400).json({message: 'Email does not exist'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: 'Password is incorrect'});
        }
        const token = jwt.sign({id: user.id}, "sherlock_holmes", {expiresIn: '1h'});
        res.status(200).json({token});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

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
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }
        if (req.body.profile_pic) {
            const existingUser = await users.findOne({where: {profile_pic: req.body.profile_pic}});
            if (existingUser) {
                return res.status(400).json({message: 'Profile picture already exists'});
            }
        }
        if (req.body.bio) {
            const existingUser = await users.findOne({where: {bio: req.body.bio}});
            if (existingUser) {
                return res.status(400).json({message: 'Bio already exists'});
            }
        }
        if (req.body.first_name) {
            const existingUser = await users.findOne({where: {first_name: req.body.first_name}});
            if (existingUser) {
                return res.status(400).json({message: 'First name already exists'});
            }
        }   
        if (req.body.last_name) {
            const existingUser = await users.findOne({where: {last_name: req.body.last_name}});
            if (existingUser) {
                return res.status(400).json({message: 'Last name already exists'});
            }
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