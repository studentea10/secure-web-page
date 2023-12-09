const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3002;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(csurf());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite database setup
const db = new sqlite3.Database(':memory:');

// Create a users table that is implemented securely.
db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');

// When storing a password, hash it first.
const saltRounds = 10;

// Registration route
app.get('/register', (req, res) => {
  res.render('register.ejs', { csrfToken: req.csrfToken() });
});

app.post('/register', async (req, res) => {
  // ... (your registration logic)

  res.redirect('/login');
});

// Login route
app.get('/login', (req, res) => {
  res.render('login.ejs', { csrfToken: req.csrfToken() });
});

app.post('/login', async (req, res) => {
  // ... (your login logic)

  res.redirect('/blog');
});


// Blog route
app.get('/blog', (req, res) => {
  // Render the blog page or perform other blog-related logic
  res.render('blog.ejs', { posts: [] }); // It might be necessary to send real data from your database.
});

// New Post route
app.get('/blog/new', (req, res) => {
  res.render('new-post.ejs', { csrfToken: req.csrfToken() });
});

app.post('/blog/new', async (req, res) => {
  // ... (logic for creating a new post)

  res.redirect('/blog');
});

// Other existing routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

