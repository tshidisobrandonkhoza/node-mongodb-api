const express = require('express');
//init app
const app = express()
const port = 2000;



const http = require('http');
const hostname = `localhost`;
//use middleware 
app.use(express.json());


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
    // paginations

    const page = req.query.page || 0;
    const pageLimit = 2;




    let eachItem = [];

    db.collection('meals')
        .find()
        .skip(page * pageLimit)
        .limit(pageLimit)
        .forEach(element => {
            eachItem.push(element);
        })
        .then(() => {
            res.status(200).json(eachItem)
        })
        .catch(() => {
            res.status(500).json({ error: "Couldnt find the object" })
        });

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

//route post handler

app.post('/meals', (req, res) => {
    //receives json data
    const meal = req.body
    db.collection('meals')
        .insertOne(meal)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ error: "coundlnt post" });
        });

});

//route params delete
app.delete('/meals/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        //res.status()

        db.collection('meals')
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then(results => {
                res.status(200).json(results)
            })
            .catch(() => {
                res.status(500).json({ error: "Couldnt find the object" })
            })
    } else {
        res.status(500).json({ error: 'Not a valid doc id' })
    }

});

//route params upadate
app.patch('/meals/:id', (req, res) => {
    const update = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('meals')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
            .then((results) => {
                res.status(200).json(results)
            })
            .catch(() => {
                res.status(500).json({ error: "Couldnt find the object" })
            });
    } else {
        res.status(500).json({ error: 'Not a valid id' })
    }

})



