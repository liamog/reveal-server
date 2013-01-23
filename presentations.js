/**
 * Module dependencies.
 */

 var fs = require('fs'),
 path = require('path'),
 EventEmitter = require('events').EventEmitter;

/**
 * Export the constructor.
 */

 var presentations = exports = module.exports = {
 	watch:  function (folder, fn) { 		
		//This is an array of presentation objects, where each one represents a single presentation folder.
		fs.readdir(folder, function(err,files){
			if(!err){

				files.forEach(function(dir) {
					var presentation = {};

					presentation.url = '/' + dir;
					presentation.path = path.join(folder, dir, 'app');
					fs.readFile(path.join(presentation.path, "config.json"), "utf8", function(err, data) {
						if(!err){
						// we have some title data.
							var loadedconfig = JSON.parse(data);
							presentation.title = loadedconfig.title ? loadedconfig.title : dir;
							presentation.loadedConfig = loadedconfig;
						}
						else{
							presentation.title = dir;

						}
						
						fs.readFile(path.join(presentation.path, "slides.html"), "utf8", function(err, data) {
							if(!err){
								presentation.slides = data;
							}
							else{
								presentation.slides = "<p>You must have your slides in the app/slides.html file</p>";
							}

							// Fire the call back.
							if (fn) {
							fn(presentation);
						}
						});

						
					});
					
				});
			}
			else {
				console.log("err = ", err);
			}
			
		});
	}
};
/**
 * Default error event listener to prevent uncaught exceptions.
 */

 var defaultError = function () {};



/**
 * Inherits from EventEmitter.
 */

 presentations.__proto__ = EventEmitter.prototype;

/**
 * Accessor shortcut for the presentations
 *
 * @api public
 */

 presentations.__defineGetter__('list', function () {
 	return this._list;
 });

