const {users} = require('../models');

exports.createUser = async (req, res) => {
    try{
        const {first_name, last_name, email, password} = req.body;
        const newUser = await users.create({
            first_name,
            last_name,
            email,
            password
        });
        res.status(201).json(newUser);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await users.findAll();
        res.status(200).json(users);
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.getUserById = async (req, res) => {
    try{
        const {id} = req.params;
        const user = await users.findByPk(id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
}