'use strict';

module.exports = function(grunt){

	var defaultAssets = require('./config/assets/default');

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		meta: {
			basePath: 'public/',
			sassPath: '<%= meta.basePath %>sass/',
			cssPath: '<%= meta.basePath %>css/',
			jsPath: '<%= meta.basePath %>js/'
		},

		sass: {
			dist: {
				files: {
					'<%= meta.cssPath %>index.css': '<%= meta.sassPath %>index.sass'
				}
			}
		},

		compass: {
			dist: {
				options: {
					sassDir: '<%= meta.sassPath %>',
					cssDir: '<%= meta.cssPath %>',
					raw: 'Encoding.default_external = \'utf-8\'\n'
				}
			}
		},

		uglify: {
			all: {}
		},

		watch: {
			css: {
				files: [
					'<%= meta.sassPath %>*.sass',
					'<%= meta.sassPath %>**/*.sass'
				],

				tasks: ['sass']
			},
			compass: {
				files: [
					'<%= meta.sassPath %>*.sass',
					'<%= meta.sassPath %>**/*.sass'
				],

				tasks: ['compass']
			},
			js: {
				files: [
					'<%= meta.jsPath %>*.js',
					'<%= meta.jsPath %>**/*.js'
				],

				tasks: ['uglify']
			}
		},

		express: {
			dev: {
				options: {
					script: 'server.js'
				}
			}
		},

		nodemon: {
			dev: {
				script: 'server.js'
			}
		}
	});

	// There is running sass watch.
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-express-server');

	// Automatically restart server when files change
	grunt.loadNpmTasks('grunt-nodemon');

	// build default task
	grunt.registerTask('default', 'nodemon');

	// build dev task
	grunt.registerTask('dev', 'development tasks', function(){
		var taskList = [
			'express:dev',
			'watch'
		]

		grunt.task.run(taskList);
	});
};