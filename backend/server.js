const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require('./config');
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: config.mailProvider,
    auth: {
        user: config.mailSender,
        pass: config.mailPassword
    }
});

var db;

MongoClient.connect(`mongodb://${config.dbUser}:${config.dbPassword}@ds119395.mlab.com:19395/${config.dbName}`, (err, client) => {
    if (err) return console.log(err)
    db = client.db(config.dbName);
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
        if (err) {
            res.send({ status: "error", error: err });
            return;
        };

        res.send(results);
    });
});

app.post('/orders/accept', (req, res) => {
    console.log(req.id)
    db.collection('orders').findOne({ _id: ObjectID(req.body._id) })
        .then(result => {
            db.collection('orders').updateOne({ _id: result._id }, { $set: { ...result, status: "validated" } })
                .then(obj => {

                    var mailOptions = {
                        from: config.mailSender,
                        to: req.body.email,
                        subject: "[MerciGustave] Votre demande d'essai a été acceptée !",
                        text: `Bonjour ${req.body.firstname} ${req.body.lastname}, nous avons le plaisir de vous annoncer que nous venons de valider votre demande d'essai !`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log("Erreur lors de l'envoi de l'email :", error);
                        } else {
                            console.log('Email envoyé: ', info.response);
                        }
                    });

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

                    var mailOptions = {
                        from: config.mailSender,
                        to: req.body.email,
                        subject: "[MerciGustave] Votre demande d'essai a été refusée !",
                        text: `Bonjour ${req.body.firstname} ${req.body.lastname}, nous sommes au regret de vous annoncer que votre demande d'essai a été refusée.`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log("Erreur lors de l'envoi de l'email :", error);
                        } else {
                            console.log('Email envoyé: ', info.response);
                        }
                    });

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