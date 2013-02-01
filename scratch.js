/**
 * Module dependencies.
 */

/**
* Export the constructor.
*/

var mustache = require('mustache');

var presentations = {
	list : {},

	watch: function (folder, fn) {
		console.log(folder);
		this.list[folder.name] = folder;
	},
}


presentations.watch({name:"test", title:"TEST"})

console.log(mustache);
