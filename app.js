require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const port = process.env.Port 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(`mongodb://localhost:27017/mydatabase`).then(function() {
    console.log('Database connection is working');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    const message = req.query.message; 
    res.render('contact', { message });
});

app.get('/login', (req, res) => {
    res.render('login', { message: undefined });
});

app.post('/submit-form', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.redirect('/contact?message=Your ID has been created!');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { message: 'Invalid email or password.' });
        }

        const isMatch = password === user.password;

        if (isMatch) {
            return res.redirect('/');
        } else {
            return res.render('login', { message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error(error);
        res.render('login', { message: 'An error occurred. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
