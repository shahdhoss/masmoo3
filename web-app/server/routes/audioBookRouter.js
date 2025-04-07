const express = require('express');
const router = express.Router();
const audioBookController = require('../controllers/audioBookController');

router.get('/', audioBookController.getAll);
router.get('/:id', audioBookController.getById);

module.exports = router;