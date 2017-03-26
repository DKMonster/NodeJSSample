'use strict';

var express = require('express');
var path = require('path');
var router = express.Router();

// GET route for /
router.route('/')
	.get(function(request, response){
		response.sendFile(path.join(__dirname, '../public', 'index.html'));
		// console.log(__dirname);
	});

module.exports = router;