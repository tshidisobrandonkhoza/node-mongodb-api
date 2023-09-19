const express = require('express');
//init app
const app = express()
const port = 2000;



const http = require('http');
const hostname = `localhost`;



//db connect

const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb');
let db;
connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Listening on ${port}`);
        });
        db = getDb()
    }
});


//route get handler
app.get('/meals', (req, res) => {
    let eachItem = [];

    db.collection('meals')
        .find({ 'title': 'dessert' })
        .forEach(element => {
            eachItem.push(element);
        })
        .then(() => {
            res.status(200).json(eachItem)
        })
        .catch(() => {
            res.status(500).json({ error: "Couldnt find the object" })
        });

    // res.send(eachItem);
    //  res.json({ message: 'Welcome to the api' });
});


//route params  handler
app.get('/meals/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('meals')
            .findOne({ _id: new ObjectId(req.params.id) })
            .then((doc) => {
                res.status(200).json(doc)
            })
            .catch(() => {
                res.status(500).json({ error: "Couldnt find the object" })
            });
    } else {
        res.status(500).json({ error: 'Not a valid id' })
    }



});

