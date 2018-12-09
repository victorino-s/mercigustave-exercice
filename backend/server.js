const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect('mongodb://admin:mercigustave1@ds119395.mlab.com:19395/gtechtest', (err, client) => {
    if (err) return console.log(err)
    db = client.db('gtechtest');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + './index.html')
});

app.post('/orders', (req, res) => {
    console.log("New order incoming :");
    console.log(req.body);

    db.collection('orders').insertOne(req.body, (err, result) => {
        if (err) console.log(err)
        console.log('saved to database')
        res.send({ status: err ? 'error' : 'success' });
    });
});

app.get('/orders', (req, res) => {
    db.collection('orders').find().toArray((err, results) => {
        if (err) return console.log(err);
        res.send(results);
    });
});

app.post('/orders/accept', (req, res) => {
    console.log(req.id)
    db.collection('orders').findOne({ _id: ObjectID(req.body._id) })
    .then(result => {
        db.collection('orders').updateOne({ _id: result._id }, { $set: { ...result, status: "accepted" } })
            .then(obj => {
                res.send({ status: "success", order: obj });
            })
            .catch(error => {
                console.log(error);
                res.send({ status: "error", error: error });
            });
    })
    .catch(error => {
        console.log(error);
        res.send({ status: "error", error: error });
    })
});

app.post('/orders/reject', (req, res) => {
    console.log(req.id)
    db.collection('orders').findOne({ _id: ObjectID(req.body._id) })
    .then(result => {
        db.collection('orders').updateOne({ _id: result._id }, { $set: { ...result, status: "rejected" } })
            .then(obj => {
                res.send({ status: "success", order: obj });
            })
            .catch(error => {
                console.log(error);
                res.send({ status: "error", error: error });
            });
    })
    .catch(error => {
        console.log(error);
        res.send({ status: "error", error: error });
    })
});


app.listen(3003, () => {
    console.log('MerciGustave API Server is running on port 3003');
});