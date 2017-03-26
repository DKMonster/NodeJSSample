'use strict'

var fs = require('fs');
var morgan = require('morgan');

module.exports.start = function start(app, _dir) {

	app.use(morgan('combined'));

};

function writeConnectLogFile() {

	// get datetime  using datetime.toDateString()
	var filename;
	var datetime = new Date();
	filename = datetime.toDateString().split(' ').join('-');

	// create a write stream (in append mode)
	var logDirectory = _dir + '/logger/Connect-'+ filename +'.log';
	var connectLogStream = fs.createWriteStream(logDirectory, {flags: 'a+'});

	connectLogStream.write('Hello\n');
	connectLogStream.end();
};