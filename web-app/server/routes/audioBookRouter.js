const express = require('express');
const router = express.Router();
const audioBookController = require('../controllers/audioBookController');

router.get('/', audioBookController.getAll);
router.get('/:id', audioBookController.getById);
router.post('/', audioBookController.create);
router.delete('/:id', audioBookController.delete);
module.exports = router;