const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB=require('./config/db')
const app = express();
const port = 3000;
const bcrypt = require('bcryptjs')
// const Book = require('./models/Book')
// const User = require('./models/User')

const JWT_SECRET = 'your_jwt_secret_key';

app.use(bodyParser.json());
app.use(cors());

connectDB();
const userSchema = new mongoose.Schema({
  username:{type:String,required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Guest', 'Admin'], default: 'Guest' },
    // userId:{type:String,required:true}
    });


const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publicationDate:Date,
  price:Number,
  addedBy:{ type: mongoose.Schema.Types.ObjectId }
});
const User = mongoose.model('User', userSchema);
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
    console.log('User Authenticated',req.user);
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
  const { username,email, password, role} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username,email, password: hashedPassword, role });
    console.log('Signup request:',req.body);
    console.log(username);
    const savedUser = user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Get books with pagination
app.get('/api/books',  async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const { search,addedBy } = req.query;

  try {
    const matchStage = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const booksPipeline = [
      { $match: matchStage },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users', 
          localField: 'addedBy',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          author: 1,
          publicationDate: 1,
          price: 1,
          addedBy: '$userDetails.username' 
        }
      }
    ];

    const books = await Book.aggregate(booksPipeline).exec();
    const totalBooks = await Book.countDocuments(matchStage);

    res.json({ books, totalBooks });
  } catch (err) {
    res.status(500).send(err);
  }
});

//   try {
//     const match = search ? { title: { $regex: search, $options: 'i' } } : {};

//     const books = await Book.aggregate([
//       { $match: match },
//       { $skip: skip },
//       { $limit: limit },
//       { 
//         $lookup: {
//           from: 'users', // The collection name in MongoDB
//           localField: 'addedBy',
//           foreignField: '_id',
//           as: 'userDetails'
//         }
//       },
//       { $unwind: '$userDetails' },
//       {
//         $project: {
//           title: 1,
//           author: 1,
//           publicationDate: 1,
//           price: 1,
//           addedBy: '$userDetails.username' // Assuming 'username' is the field in User model
//         }
//       }
//     ]);
//     const totalBooks = await Book.countDocuments(match);

//     res.json({ books, totalBooks });
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });


// Add a new book
app.post('/api/books',  async (req, res) => {
  const { title, author, publicationDate, price } = req.body;

  const book = new Book(req.body);

  console.log(book);
  
  try {
    
    const savedBook = await book.save();
    res.json(savedBook);
    
      
    
  } catch (err) {
    res.status(400).send('Price issue');
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
