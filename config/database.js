'use strict';

var config = require('./config.js'); // default setting for database
var mongoose = require('mongoose'); // mongoose for mongodb

var counters = require('../models/counters'); // counters database
var develops = require('../models/develops'); // develops database
var walkers = require('../models/walkers'); // walkers database

module.exports.counters = counters;
module.exports.develops = develops;
module.exports.walkers = walkers;

/*
 *
 * Database Start
 * 
 */


// connect the database
module.exports.connect = function connect() {
    var options = { useMongoClient: true };
    mongoose.Promise = require('bluebird');
    // connect to mongoDB database
	mongoose.connect(config.db.uri, options)
        .then(() => {
            mongoose.connection.on('error', err => {
                console.log('mongoose connection error: '+err);
            });

            console.log('connected - attempting reconnect');
            return mongoose.connect(config.db.uri, options);
        }).catch(err => {
            console.log('rejected promise: '+err);
            mongoose.disconnect();
        });
};

// disconnect the database
module.exports.disconnect = function disconnect() {
	mongoose.disconnect(); // disconnect to mongoDB
};

