'use strict';

var express = require('express');
var path = require('path');
var multer = require('multer');
var database = require('./database.js');
var db = database.connect();

var upload = multer({ dest: __dirname + '/../tmp' });

module.exports.start = function start(app, _dir) {
	app.use(express.static('public'));

	var indexRoute = require(path.join(_dir, '/routers/index.router.js'));
	var testRoute = require(path.join(_dir, '/routers/test.router.js'));

	app.use('/', indexRoute);
	app.use('/test' , testRoute);


	/* ***************************** *
	 * ******* about develop ******* *
	 * ***************************** */
	app.get('/develop', database.develops.welcomeDevelop);
	app.post('/develop/setup', database.develops.insertDevelop);
	app.post('/develop/reset', database.develops.resetDevelop);
	app.get('/develop/users', database.develops.getAllDevelop);
	app.post('/develop/auth', database.develops.setAuthenticate);

	/* ***************************** *
	 * ********* about api ********* *
	 * ***************************** */

	// that is walker collection documents.
	app.post('/api/user/fb_exist_user', database.walkers.fbExistWalker);

	app.post('/api/user/insert_user', database.walkers.insertWalker);
	app.post('/api/user/lock_user', database.walkers.lockWalker);
	app.post('/api/user/delete_user', database.walkers.deleteWalker);
	app.post('/api/user/update_user', database.walkers.updateWalker);

	/* ****************************** *
	 * ********* about unit ********* *
	 * ****************************** */
	app.get('/api/counters/initUserIDSchema', database.counters.initUserIDSchema);
	app.get('/api/counters/insertUserIDSchema', database.counters.insertUserIDSchema);
};