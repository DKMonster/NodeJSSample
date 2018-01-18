'use strict';

module.exports = {
	db: {
		uri: '',
		options: {
			user: '',
			pwd: ''
		}
	},
	app: {
		title: "",
		version: "",
		description: "",
		author: "CodeLabs Team",
		license: "MIT"
	},
	port: {
		http: 80,
		https: 443
	},
	uri: '',
	dev: true,
	secret: "",
	env: {
	},
	session: {
		secret: ""
	},
	password_not_include: [
		'000000'
	]
};