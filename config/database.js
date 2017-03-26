'use strict';

var config = require('./config.js'); // default setting for database
var mongoose = require('mongoose'); // mongoose for mongodb

var counters = require('../models/counters'); // counters database
var develops = require('../models/develops'); // develops database
var walkers = require('../models/walkers'); // walkers database

module.exports.counters = counters;
module.exports.develops = develops;
module.exports.walkers = walkers;

// connect the database
module.exports.connect = function connect() {
	return mongoose.connect(config.db.uri); // connect to mongoDB database
};

// disconnect the database
module.exports.disconnect = function disconnect() {
	mongoose.disconnect(); // disconnect to mongoDB
};

