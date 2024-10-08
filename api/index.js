const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookiePraser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer')
const fs = require('fs');
const Place = require('./models/places')


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookiePraser());
app.use('/uploads', express.static(__dirname + "/uploads"));

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


// upload img by a link
app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';

    await imageDownloader.image({
        url: link,
        // __dirname -> is the full file path
        dest: __dirname + '/uploads/' + newName
    });
    console.log(req.body)
    res.json(newName);

})

// middleware to handle uploaded photos
const photosMiddleware = multer({dest:'uploads'});
 
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadFiles = [];
    for (let i = 0; i < req.files.length; i++) {
    
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1]; // Get the extension of the original file
        const newPath = path + '.' + ext; // Create new path with the original extension
        
        // Rename the uploaded file to include the original name and extension
        fs.renameSync(path, newPath);

        // Push the new path (relative to uploads) to the uploadFiles array
        uploadFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadFiles);
});


app.post('/places', async (req, res) => {
    const { title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests} = req.body;

    const {token} = req.cookies;   
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {

            if (err) throw err;
            const addedPhoto = addedPhotos.flat()
   
            const placesDoc = await Place.create({
                owner: userData.id,
                title, address, photos:addedPhoto,
                description, perks, extraInfo,
                checkIn, checkOut, maxGuests
            }) 
         
            res.json(placesDoc)
    })}
});

app.get('/places', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {id} = userData;
        res.json(await Place.find({owner:id}))
    })
})

app.get('/places/:id', async (req,res) => {
    const {id} = req.params;
    res.json(await Place.findById(id))
})

app.put('/places', async (req, res) => {
    const {token} = req.cookies;
    const { id, title, address, addedPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, maxGuests} = req.body;
    
    const addedPhoto = addedPhotos.flat();

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
      
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos:addedPhoto, description,
                perks, extraInfo, checkIn, checkOut, maxGuests
            })

            
            await placeDoc.save();

            res.json('succeeded')
        }

    })
    
})
app.listen(4000, () => console.log('Server running on http://localhost:4000'));

