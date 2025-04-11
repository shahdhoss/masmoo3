const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewscontroller');

router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getById);
router.get('/book/:book_id', reviewController.getByBookId);
router.post('/', reviewController.create);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.delete);

module.exports = router;