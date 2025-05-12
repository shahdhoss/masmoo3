const express = require('express')
const {createUser, loginUser, getUser,updateUser, getBooksByUser, getNumberOfAddedBooks, getUsersReviews} = require('../controllers/users.js')
const {authenticateToken} = require('../middleware')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router()

router.post('/', createUser)
router.post('/login', loginUser)
router.get("/me", authenticateToken , getUser)
router.patch("/update", authenticateToken ,  upload.single('profile_pic'),updateUser)
router.get("/uploadedbooks", authenticateToken , getBooksByUser)
router.get("/numberofaddedbooks", authenticateToken , getNumberOfAddedBooks)
router.get("/userReviews", authenticateToken, getUsersReviews)
module.exports = router;  
 