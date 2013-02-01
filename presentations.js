/**
 * Module dependencies.
 */

 var fs = require('fs'),
 path = require('path'),
 _ = require('underscore'),
 EventEmitter = require('events').EventEmitter;

/**
* Export the constructor.
*/
var presentations = {
	defaultPresentationConfig : {

		// Display controls in the bottom right corner
		controls: true,

		// Display a presentation progress bar
		progress: true,

		// Push each slide change to the browser history
		history: true,

		// Enable keyboard shortcuts for navigation
		keyboard: true,

		// Enable the slide overview mode
		overview: true,

		// Vertical centering of slides
		center: true,

		// Enables touch navigation on devices with touch input
		touch: true,

		// Loop the presentation
		loop: false,

		// Change the presentation direction to be RTL
		rtl: false,

		// Number of milliseconds between automatically proceeding to the
		// next slide, disabled when set to 0, this value can be overwritten
		// by using a data-autoslide attribute on your slides
		autoSlide: 0,

		// Enable slide navigation via mouse wheel
		mouseWheel: false,

		// Apply a 3D roll to links on hover
		rollingLinks: true,
		
		// Transition effect, one of default/cube/page/concave/zoom/linear/none
		transition:'default',

		// theme
		theme:'default'
	},

	list : [],

	watch: function (folder, fn) {
		//This is an array of presentation objects, where each one represents a single presentation folder.
		var that = this;
		
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
						_.defaults(presentation, that.defaultPresentationConfig);
						_.defaults(presentation, {title:dir});

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
							//console.log(presentation);
							that.list.push(presentation);
							
						});

					});
				});

			}
			else {
				console.log("err = ", err);
			}
		});
		
	
	}
}

exports = module.exports = presentations;
// console.log(presentations.list);
