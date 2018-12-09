const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require('./config');
var nodemailer = require('nodemailer');

// Initialisation du service mail
const transporter = nodemailer.createTransport({
    service: config.mailProvider, // service mail utilisé (ici gmail)
    auth: {
        user: config.mailSender, // adresse du compte mail
        pass: config.mailPassword // mot de passe du compte mail
    }
});

var db;

// Initialisation de la liaison à la base de données
MongoClient.connect(`mongodb://${config.dbUser}:${config.dbPassword}@ds119395.mlab.com:19395/${config.dbName}`, (err, client) => {
    if (err) return console.log(err)
    db = client.db(config.dbName);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Url de base de l'API
app.get('/', (req, res) => {
    res.sendFile(__dirname + './index.html')
});

// Point de terminaison pour l'enregistrement d'une nouvelle commande
app.post('/orders', (req, res) => {

    // Informations rentrées dans le formulaire contenues dans req.body
    db.collection('orders').insertOne(req.body, (err, result) => {
        if (err) console.log(err)
        res.send({ status: err ? 'error' : 'success' });
    });
});

// Point de terminaison pour récupérer l'ensemble des commandes.
app.get('/orders', (req, res) => {
    db.collection('orders').find().toArray((err, results) => {
        if (err) {
            res.send({ status: "error", error: err });
            return;
        };

        res.send(results);
    });
});

// Point de terminaison permettant d'accepter une commande
app.post('/orders/accept', (req, res) => {
    console.log(req.id)
    db.collection('orders').findOne({ _id: ObjectID(req.body._id) })
        .then(result => {
            // Modification du statut de la commande dans la base de données.
            db.collection('orders').updateOne({ _id: result._id }, { $set: { ...result, status: "validated" } })
                .then(obj => {
                    // Configuration du contenu de l'email à envoyer
                    var mailOptions = {
                        from: config.mailSender, // Email de l'envoyeur (configuré dans le fichier config.js)
                        to: req.body.email, // Email du client
                        subject: "[MerciGustave] Votre demande d'essai a été acceptée !",
                        text: `Bonjour ${req.body.firstname} ${req.body.lastname}, nous avons le plaisir de vous annoncer que nous venons de valider votre demande d'essai !`
                    };

                    // Envoi de l'email
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

// Point de terminaison permettant de refuser une commande
app.post('/orders/reject', (req, res) => {
    console.log(req.id)
    db.collection('orders').findOne({ _id: ObjectID(req.body._id) })
        .then(result => {
            // Modification du statut de la commande dans la base de données.
            db.collection('orders').updateOne({ _id: result._id }, { $set: { ...result, status: "rejected" } })
                .then(obj => {
                    // Configuration du contenu de l'email à envoyer
                    var mailOptions = {
                        from: config.mailSender,
                        to: req.body.email,
                        subject: "[MerciGustave] Votre demande d'essai a été refusée !",
                        text: `Bonjour ${req.body.firstname} ${req.body.lastname}, nous sommes au regret de vous annoncer que votre demande d'essai a été refusée.`
                    };
                    // Envoi de l'email
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

// Lancement du serveur sur le port 3003
app.listen(3003, () => {
    console.log('MerciGustave API Server is running on port 3003');
});