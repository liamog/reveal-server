/**
 * Module dependencies.
 */

 var fs = require('fs'),
 path = require('path'),
 _ = require('underscore')
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
					presentation.name = dir;
					presentation.url = '/' + dir;
					presentation.path = path.join(folder, dir, 'content');
					fs.readFile(path.join(presentation.path, "config.json"), "utf8", function(err, data) {
						if(!err){
						// we have some title data.
							var loadedconfig = JSON.parse(data);
							_.extend(presentation, loadedconfig);
							presentation.loadedConfig = loadedconfig;
						}
						_.defaults(presentation, {title:dir,controls:true, progress:true, history:true, center:true, transition:'default', theme:'default'}); 
						
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

