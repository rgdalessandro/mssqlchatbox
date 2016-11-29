'use strict';

const path = require('path');
const bodyParser = require('body-parser');

const db = require('./db.js');
const port = process.env.PORT || 5000;

const express = require('express');
const app = express();

/************************ MIDDLEWARE *************************/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*********************** LOCAL ASSETS ************************/
const assetFolder = path.join(__dirname, './client');
app.use(express.static(assetFolder));

/************************ CHAT PAGE *************************/
app.get('/chat', (req, res) => {
    console.log('serve up chat.html');
    res.sendFile(path.join(__dirname, './client/chat.html'));
});

/********************** CRUD MESSAGES ***********************/

// CREATE
app.post('/messages', (req, res) => {
    req.body.created_at = new Date();
    req.body.updated_at = new Date();
    console.log('message posted', req.body);
    db('messages').insert(req.body)
    .then(function(resp) {
        res.sendStatus(201);
    })
    .catch(function(err) {
        console.log('Error:', err);
        res.sendStatus(500);
    });
});

// READ
app.get('/messages', (req, res) => {
    db('messages').select()
    .then(function(resp) {
        res.status(200).json(resp);
    })
    .catch(function(err) {
        console.log('Error:', err);
        res.sendStatus(500);
    });
});

// EDIT
app.put('/messages', (req, res) => {
    const mid = req.body.mid;
    const message = req.body.message;
    const updated_at = new Date();
    console.log('message updated', mid, message, updated_at);
    db('messages').where('mid', mid).update({ message, updated_at})
    .then(function(resp) {
        res.sendStatus(200);
    })
    .catch(function(err) {
        console.log('Error:', err);
        res.sendStatus(500);
    });
});

// DELETE
app.delete('/messages', (req, res) => {
    const mid = req.body.mid;
    console.log('message deleted', mid);
    db('messages').where('mid', mid).del()
    .then(function(resp) {
        res.sendStatus(200);
    })
    .catch(function(err) {
        console.log('Error:', err);
        res.sendStatus(500);
    });
});

/************************ CATCH-ALL *************************/
app.get('*', (req, res) => {
    console.log('serve up index.html');
    res.sendFile(path.join(__dirname, './client/index.html'));
});

app.listen(port);
console.log('Server started and listening on port', port);
console.log('NODE_ENV:', process.env.NODE_ENV);