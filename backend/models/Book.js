const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publicationDate: Date,
  price: Number,
  addedBy: { type: mongoose.Schema.Types.ObjectId } // Reference to User
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
