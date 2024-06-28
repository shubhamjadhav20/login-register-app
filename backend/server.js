const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB=require('./config/db')
const app = express();
const port = 3000;
const bcrypt = require('bcryptjs')

const JWT_SECRET = 'your_jwt_secret_key';

app.use(bodyParser.json());
app.use(cors());

connectDB();
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Guest', 'Admin'], default: 'Guest' }
  });
  
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publicationDate:Date,
  price:Number
});
const User=mongoose.model('User',userSchema);
const Book = mongoose.model('Book', bookSchema);

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // console.log("Error");
      return res.sendStatus(403);}
    req.user = user;
    next();
  });
};
// const checkAdmin = (req, res, next) => {
//   if (req.user.role !== 'Admin') return res.sendStatus(403);
//   next();
// };
app.put('/api/books/:id', async (req, res) => {
  const { title, author, publicationDate, price } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, publicationDate, price }, { new: true });
    if (!updatedBook) return res.status(404).send('Book not found');
    res.json(updatedBook);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
app.post('/logout', authenticateToken, (req, res) => {
  
  res.status(200).send({ auth: false, token: null, message: 'Logout successful' });
});
app.post('/api/signup', async (req, res) => {
  console.log('test');
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Get books with pagination
app.get('/api/books',authenticateToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  console.log("server.js")
 const {search} = req.query;
 console.log(search)
  
  try {
    const books = await Book.find({ title: { $regex: search, $options: 'i' } }).skip(skip).limit(limit);
    console.log(books);
    const totalBooks= await Book.countDocuments({ title: { $regex: search, $options: 'i' } });
    console.log(books);
    console.log(totalBooks);
    res.json({books,totalBooks});
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a new book
app.post('/api/books',  async (req, res) => {
  const book = new Book(req.body);
  console.log(book);
  
  try {
    if(book.price>150){
    const savedBook = await book.save();
    res.json(savedBook);}
    else{
      res.status(400).send('Price issue');
    }
  } catch (err) {
    res.status(500).send(err);
  }

});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id).exec();
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
