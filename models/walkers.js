'use strict';

var config = require('../config/config.js');
var jwt = require('jsonwebtoken'); // that is token
var mongoose = require('mongoose'); // mongoose for mongodb
var counters = require('../models/counters'); // counters database
var schema = mongoose.Schema;
var walkerSchema = new schema({
	id: Number,
	name: String,
	gender: String,
	birthday: Date,
	picture: String,

	email: String,
	password: String,

	introduction: String,
	registerType: String,
	locale: String,
	timezone: String,

	registerDate: {type: Date, default: Date.now},
	updateDate: Date,

	lock: Boolean,
	verified: Boolean
});

var walkers = mongoose.model('walker', walkerSchema);

/* ****************************** *
 * ******* module exports ******* *
 * ****************************** */

 var moduleWalker = module.exports = {

 	fbExistWalker: function fbExistWalker(req, res) {

 		moduleWalker.tokenCheckSpace(req, res, function(req, res){

			var responseData = {};

			mongoose.model('walker').find({
				thrid: {
					fb: {
						enable: true,
						id: req.body.id
					}
				}
			}, function(err, result){
				
				if(result.length === 0) {
					// not exist maybe you can go to insert that.
					responseData.exist = false;
					responseData.sys_code = 200;
					responseData.sys_msg = 'This Account is not exist.';
					res.send(responseData);
				}else{
					responseData.exist = true;
					responseData.sys_code = 200;
					responseData.sys_msg = 'This Account is exist.';
					res.send(responseData);
				}
			});
 			
 		});
 	},

	existWalker: function existWalker(email, callback) {

		mongoose.model('walker').find({email: email}, function(err, result){
			
			if(result.length === 0) {
				callback(false);
			}else{
				callback(true);
			}
		});
	},

	// add the one walker user
	insertWalker: function insertWalker(req, res) {

 		moduleWalker.tokenCheckSpace(req, res, function(req, res){
			var walker = new walkers();

			walker.name = req.body.name;
			walker.email = req.body.email;
			walker.password = req.body.password;
			walker.gender = req.body.gender;
			walker.birthday = req.body.birthday;
			walker.picture = req.body.picture;

			walker.registerType = req.body.registerType;

			walker.locale = req.headers["accept-language"];
			walker.timezone = (-(new Date().getTimezoneOffset()/60));

			walker.lock = false;
			walker.verified = false;

			var responseData = {};

			moduleWalker.existWalker(walker.email, function(exist) {

				if(exist) {
					// user is exist.
					responseData.sys_code = 500;
					responseData.sys_msg = 'The email is already exist.';
					res.send(responseData);
				}else{
					// find next id.
					counters.findNextUserID(function(seq){

					 	walker.id = seq;

						// let's user can be register.
						walker.save(function(err){
							if(err) { // got some error.
								responseData.sys_code = 404;
								responseData.sys_msg = err;
								res.send(responseData);
							}else{ // insert complete.
								responseData.sys_code = 200;
								responseData.sys_msg = 'The data is insert complete!';
								res.send(responseData);
							}
						});

					});
				}
			});
		});
	},

	// lock the one walker user
	lockWalker: function lockWalker(req, res) {

 		moduleWalker.tokenCheckSpace(req, res, function(req, res){

			walkers.findOne({'id': req.body.id}, function(err, result){

				var responseData = {};
				if(!err) { // the walker user exist
					if(result.lock) {
						walkers.update({'id': req.body.id}, {lock: false}, function(err, result){
							responseData.sys_code = 200;
							responseData.sys_msg = 'The user is unlock!';
							res.send(responseData);
						});
					}else{
						walkers.update({'id': req.body.id}, {lock: true}, function(err, result){
							responseData.sys_code = 200;
							responseData.sys_msg = 'The user is lock!';
							res.send(responseData);
						});
					}
				}else{
					responseData.sys_code = 404;
					responseData.sys_msg = err;
					res.send(responseData);
				}
			});
		});
	},

	// get request data for update.
	getRequestData: function getRequestData(req) {
		var walker = {};

		if(req.body.name) walker.name = req.body.name;
		if(req.body.firstName) walker.firstName = req.body.firstName;
		if(req.body.lastName) walker.lastName = req.body.lastName;
		if(req.body.email) walker.email = req.body.email;
		if(req.body.gender) walker.gender = req.body.gender;
		if(req.body.birthday) walker.birthday = req.body.birthday;
		if(req.body.picture) walker.picture = req.body.picture;
		if(req.body.introduction) walker.introduction = req.body.introduction;

		walker.updateDate = new Date();

		return walker;
	},

	// update the walker user
	updateWalker: function updateWalker(req, res) {

 		moduleWalker.tokenCheckSpace(req, res, function(req, res){
			var responseData = {};
			var fields = moduleWalker.getRequestData(req);
			walkers.findOneAndUpdate({'id': req.body.id}, fields, {new: true}, function(err, result){
				if(!err) {
					responseData.sys_code = 200;
					responseData.sys_msg = 'The data update is complete!';
					res.send(responseData);
				}else{
					responseData.sys_code = 404;
					responseData.sys_msg = 'Something wrong when updating data!';
					res.send(responseData);
				}
			});
		});
	},

	// delete the walker user 
	deleteWalker: function deleteWalker(req, res) {

 		moduleWalker.tokenCheckSpace(req, res, function(req, res){
			var responseData = {};
			walkers.findOneAndRemove({'id': req.body.id}, function(err, result){
				if(!err) {
					responseData.sys_code = 200;
					responseData.sys_msg = 'The user delete is complete.';
					res.send(responseData);
				}else{
					responseData.sys_code = 404;
					responseData.sys_msg = 'Something wrong when delete data!';
					res.send(responseData);
				}
			});
		});
	},

	// check the token.
	tokenCheckSpace: function tokenCheckSpace(req, res, callback) {
		var responseData = {};
		if(config.dev) {
			// dev now
			var token = req.body.token || req.query.token || req.headers['x-access-token'];

			if(token) {
				jwt.verify(token, config.secret, function(err, decoded) {
					if(err) {
						responseData.sys_code = 403;
						responseData.sys_msg = "Failed to authenticate token.";
						res.send(responseData);
					}else{
						req.decoded = decoded;
						callback(req, res);
					}
				});
			}else{
				responseData.sys_code = 403;
				responseData.sys_msg = "No token provided";
				res.send(responseData);
			}
		}else{
			// no dev
			callback(req, res);
		}
	}

 };