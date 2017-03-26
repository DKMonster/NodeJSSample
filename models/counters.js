'use strict';

var config = require('../config/config.js');
var jwt = require('jsonwebtoken'); // that is token
var mongoose = require('mongoose'); // mongoose for mongodb
var schema = mongoose.Schema;
var counterSchema = new schema({
	_id: String,
	seq: Number
});

var counters = mongoose.model('counter', counterSchema);

/* ****************************** *
 * ******* module exports ******* *
 * ****************************** */

 var moduleCounters = module.exports = {
 	// add the userID count to counter.
 	insertUserIDSchema: function insertUserIDSchema(req, res) {

 		moduleCounters.tokenCheckSpace(req, res, function(req, res){
	 		var counter = new counters();

	 		counter._id = 'userID';
	 		counter.seq = 1;

	 		counter.save(function(err){
	 			if(!err) {
	 				res.send('Insert Complete.');
	 			}else{
	 				res.send('Got Some Error.');
	 			}
	 		});
	 	});
 	},

 	// reset the database.
 	initUserIDSchema: function initUserIDSchema(req, res) {

 		moduleCounters.tokenCheckSpace(req, res, function(req, res){
	 		var responseData = {};
			// init user all data.
			mongoose.model('walker').remove({}, function(err, result){
				if(!err) {
					responseData.sys_code = 200;
					responseData.sys_msg = 'The user reset is complete.';

			 		// counter setting userID is zero.
					mongoose.model('counter').findByIdAndUpdate('userID', {seq: 1}, function(err, result){
						if(!err) {
							res.send(responseData);
						}
					});
					
				}else{
					responseData.sys_code = 404;
					responseData.sys_msg = 'Something wrong when reset data!';
					res.send(responseData);
				}
			});
		});
 	},

 	// find next user ID.
	findNextUserID: function findNextUserID(callback) {
		mongoose.model('counter').findByIdAndUpdate('userID', {$inc: {seq: 1}}, function(err, result){
			if(!err)
				callback(result.seq);
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