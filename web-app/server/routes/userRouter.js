const express = require('express')
const {createUser, loginUser, getUser,updateUser, getBooksByUser, getNumberOfAddedBooks} = require('../controllers/users')
const {authenticateToken} = require('../middleware')
const router = express.Router()

router.post('/', createUser)
router.post('/login', loginUser)
router.get("/me", authenticateToken , getUser)
router.patch("/update", authenticateToken , updateUser)
router.get("/uploadedbooks", authenticateToken , getBooksByUser)
router.get("/numberofaddedbooks", authenticateToken , getNumberOfAddedBooks)
module.exports = router;  
 