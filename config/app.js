'use strict';

module.exports.start = function start(_dir) {

	// set up -------------------------------------
	var express = require('express');
	var locale = require("locale"); // load the locale
	var app = express(); // create our app w/ express
	var path = require('path'); // path join url path
	var morgan = require('morgan');	// log requests to the console (express4)
	var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
	var cookieParser = require('cookie-parser'); // cookie
	var session = require('express-session'); // session
	var methodOverride = require('method-override');
	var https = require('https');
	var fs = require('fs');

	// configuration ------------------------------
	var config = require('./config.js');
	var logger = require('./logger.js');
	var router = require('./routers.js');

	// var db = database.connect();
	app.use(morgan('dev')); // log every request to the console
	app.use(bodyParser.urlencoded({extended: 'true'}));	// parse application/x-www-form-urlencoded
	app.use(bodyParser.json());	// parse application/json
	app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
	app.use(methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use("/public", express.static(path.join(__dirname, 'public'))); // set the static files location /public/img will be /img for users

	app.use(cookieParser()); // cookie
	app.use(session({
		secret: config.session.secret,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true }
	})); // session

	// set open ssl key
	// var hskey = fs.readFileSync('key/key.pem', 'utf8');
	// var hscert = fs.readFileSync('key/cert.pem', 'utf8'); // test server
	// var credentials = {
	// 	key: hskey,
	// 	cert: hscert
	// };

	// logger morgan
	logger.start(app, _dir);

	router.start(app, _dir);

	app.listen(config.port);

	// https listen.
	// https.createServer(credentials, app).listen(config.port.https);

	console.log('-----------------------------');
	console.log('\t');
	console.log('Server:\t\t' + config.app.title);
	console.log('Version:\t' + config.app.version);
	console.log('Http Port:\t' + config.port.http);
	// console.log('Https Port:\t' + config.port.https);
	console.log('\t');
	console.log('-----------------------------');
};