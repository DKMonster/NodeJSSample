'use strict';

var express = require('express');
var path = require('path');
var router = express.Router();

// GET route for /test
router.route('/')
	.get(function(request, response){
		response.sendFile(path.join(__dirname, '../public', 'test.html'));
	});

module.exports = router;