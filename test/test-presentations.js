var assert = require('assert');
var path = require('path');


var testpres = require('../presentations.js');

exports['load'] = function (test) {
	count = 0;
	testpres.watch(path.join(__dirname, 'presentations'), function(presentation){
		//console.log("Found presentation = " + JSON.stringify(presentation));
		// We are expecting 3 presentations
		count++;
		switch(presentation.url)
		{
			case "/pres1":
		    test.equal(presentation.title, "pres1");
		    test.equal(presentation.loadedConfig, null);
		    test.notEqual(presentation.path, null);
		    test.notEqual(presentation.slides, null);
		    test.notEqual(presentation.slides.search("First Slide"), -1);
			break;

			case "/pres2":
		    test.equal(presentation.title, "Presentation 2 - Title");
		    test.notEqual(presentation.loadedConfig, null);
		    test.notEqual(presentation.path, null);
		    test.notEqual(presentation.slides, null);
		    test.notEqual(presentation.slides.search("You must have your"), -1);
			break;

			case "/pres3":
		    test.equal(presentation.title, "pres3");
		    test.equal(presentation.loadedConfig, null);
		    test.notEqual(presentation.slides, null);
		    test.notEqual(presentation.path, null);
		    test.notEqual(presentation.slides.search("You must have your"), -1);
			break;
		}
		if(count == 3)
			test.done();
	});
};

