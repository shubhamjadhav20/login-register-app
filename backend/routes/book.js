const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const verifyToken = require('../middleware/auth');

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).send('Book not found');
    res.send(book);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
