const express = require('express')
const {createUser, loginUser, getUser,updateUser} = require('../controllers/users')
const {authenticateToken} = require('../middleware')
const router = express.Router()

router.post('/', createUser)
router.post('/login', loginUser)
router.get("/me", authenticateToken , getUser)
router.patch("/update", authenticateToken , updateUser)

module.exports = router;  
 