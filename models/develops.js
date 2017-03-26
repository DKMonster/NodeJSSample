'use strict';

var config = require('../config/config.js');
var uniqid = require('uniqid');
var crypto = require('crypto-js'); // that is md5
var jwt = require('jsonwebtoken'); // that is token
var mongoose = require('mongoose'); // mongoose for mongodb
var schema = mongoose.Schema;
var developSchema = new schema({
	_id: String,
	acc: String,
	pwd: String,
	name: String
});

var develops = mongoose.model('develop', developSchema);

/* ****************************** *
 * ******* module exports ******* *
 * ****************************** */

 var moduleDevelops = module.exports = {
 	// welcome page.
 	welcomeDevelop: function welcomeDevelop(req, res) {
 		res.send({ message: "Welcome to the develop space!" });
 	},
 	// add the develop user account.
 	insertDevelop: function insertDevelop(req, res) {
 		var develop = new develops();

 		develop._id = uniqid();
 		develop.acc = req.body.acc;
 		develop.pwd = crypto.MD5(req.body.pwd).toString();
 		develop.name = req.body.name;

 		develop.save(function(err){
 			if(!err) {
 				res.send('Insert Complete.');
 			}else{
 				res.send(err);
 			}
 		});
 	},
 	// get the all develop user.
 	getAllDevelop: function getAllDevelop(req, res) {
 		develops.find({}, function(err, users) {
 			res.json(users);
 		});
 	},
 	// reset the all develop user
 	resetDevelop: function resetDevelop(req, res) {
 		develops.remove({}, function(err, result) {
 			res.json(result);
 		});
 	},
 	// set develop authenticate
 	setAuthenticate: function setAuthenticate(req, res) {
 		var acc = req.body.acc;
 		var pwd = crypto.MD5(req.body.pwd).toString();

 		develops.findOne({
 			acc: acc
 		}, function(err, user) {

 			var responseData = {};

 			if(!err) {

 				if(!user) {
 					responseData.sys_code = 404;
 					responseData.sys_msg = 'User not found, Authentication failed.';
 					res.send(responseData);
 				}else{
 					if(user.pwd != pwd) {
	 					responseData.sys_code = 500;
	 					responseData.sys_msg = 'Authentication failed. Wrong password.';
	 					res.send(responseData);
 					}else{
 						// sign a token.
 						var token = jwt.sign({ data: user.acc }, config.secret, {
 							expiresIn: '24h' // expires in 24 hours
 						});

	 					responseData.sys_code = 200;
	 					responseData.sys_msg = 'Enjoy your token! you had 24 hours to using.';
	 					responseData.token = token;
	 					res.send(responseData);
 					}
 				}
 			}else{
 				res.send(err);
 			}
 		});
 	}


 };