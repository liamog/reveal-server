var assert = require('assert');
var path = require('path');


var testpres = require('../presentations.js');

exports['load'] = function (test) {
	count = 0;
	testpres.watch(path.join(__dirname, 'presentations'), function(presentation){
		console.log("Found presentation = " + JSON.stringify(presentation));
		// We are expecting 3 presentations
		count++;
		switch(presentation.name)
		{
			case "pres1":
		    test.equal(presentation.title, "pres1");
		    test.equal(presentation.url, "/pres1");
		    test.equal(presentation.loadedConfig, null);
		    test.notEqual(presentation.path, null);
		    test.notEqual(presentation.slides, null);
		    test.notEqual(presentation.slides.search("First Slide"), -1);
			break;

			case "pres2":
		    test.equal(presentation.title, "Presentation 2 - Title");
		    test.equal(presentation.url, "/pres2");
		    test.notEqual(presentation.loadedConfig, null);
		    // Have we correct overridden our props?
		 
			test.equal(presentation.center, false);
			test.equal(presentation.theme, "ciscosimple");
			test.equal(presentation.transition, "other");
		    test.notEqual(presentation.path, null);
		    test.notEqual(presentation.slides, null);
		    test.notEqual(presentation.slides.search("You must have your"), -1);
			break;

			case "pres3":
		    test.equal(presentation.title, "pres3");
		    test.equal(presentation.url, "/pres3");
		    test.equal(presentation.loadedConfig, null);
		    test.notEqual(presentation.slides, null);
		    test.notEqual(presentation.path, null);
		    test.notEqual(presentation.slides.search("You must have your"), -1);
			break;

			default:
			// Fail out if unexpected presentation returned.
			test.equal(false, true);
		}
		if(count == 3)
			test.done();
	});
};

