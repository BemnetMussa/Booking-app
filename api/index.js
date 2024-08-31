const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookiePraser = require('cookie-parser');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookiePraser())

const jwtSecret = "let seeeeeeeeeeeeeeeeewoierjiowrj"

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

// connecting to the database
mongoose.connect("mongodb://localhost:27017/Booking");

// to create the strcutrue of the data
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

//  creating a collection model called clients with the userSchema structure 
const User = mongoose.model('User', userSchema, 'clients');

app.get('/test', (req, res) => {
    res.json('test.');
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) throw err;
            const {name, email, id} = await User.findById(user.id)

            res.json({name, email, id})
        })
    } else {
        res.json(null)
    }

})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        });
        console.log("it worked");
        res.json(userDoc);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Await the result of the database query
        const userDoc = await User.findOne({ email });

        // Check if userDoc exists and compare passwords
        if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
            jwt.sign({email:userDoc.email, id:userDoc._id, name:userDoc.name}, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                console.log("down here")
                console.log(userDoc.name)
              
                res.cookie('token', token).json(userDoc)
                

            })
           
        } else {
            res.status(422).json("Invalid email or password");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token','').json(true)
})

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
