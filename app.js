const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/authRoutes')
const cookie = require('cookie-parser')
const {requireAuth, checkUser} = require('./middlewares/authMiddleware')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookie())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Devansh:DeV8anS@cluster0.qqdurey.mongodb.net/jwt-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }, 
  console.log('DB CONNECTED SUCCESSFULLY'))
  .then((result) => app.listen(3000), console.log('SERVER IS LISTENING...'))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth ,  (req, res) => res.render('smoothies'));
app.use(routes)

// cookies
