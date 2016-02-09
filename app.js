import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import co from 'co';
var app = express();

/*var models = require('./app/models');
app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

import {DATABASE, PORT, JSON_SPACES, SERVERNAME} from './app/config';

import api from './app/controllers/api';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

mongoose.set('debug', true);
mongoose.connect(DATABASE, function (error) {
    if (error) {
        console.log(error);
    }
});

app.set('json spaces', JSON_SPACES);

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Content-Length, X-Requested-With, token');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain); //Add this

app.use('/api/v1', api);
app.listen(PORT);
