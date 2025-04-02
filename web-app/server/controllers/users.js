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