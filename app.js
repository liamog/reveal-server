
/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path')
 , dust = require('dustjs-linkedin')
 , fs = require('fs');

 var app = express();

 dust.optimizers.format = function(ctx, node) { return node };

 app.configure(function(){
  var compiled= dust.compile(
    fs.readFileSync( path.join(__dirname, 'reveal.js', 'dust_index.html'), 'utf-8'),
    "reveal");
  dust.loadSource(compiled);

app.enable('strict routing');
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  // Add a handler for each presentation folder here. 
  fs.readdir(path.join(__dirname, 'presentations'), function(err,files){
   files.forEach(function(dir) {
    var url = '/' + dir;
    var dirPath = path.join(__dirname, 'presentations', dir, 'app');

    app.all(url, function(req, res) { res.redirect(url + '/'); });
    
    console.log("Found Pressie - configuring url=" + url + " dir=" + dirPath);
    app.get(url +'/' , function(req, res){
      fs.readFile(path.join(dirPath, "index.html"), "utf-8", function(err, data){
        // Here we use the dust templating to 
        // insert our slides and the title.
        dust.render("reveal", {title: "present", slides: data}, function(err,out){
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Content-Length', out.length);
          res.end(out);
        });
    });
    });
    app.use(url, express.static(dirPath));
    app.use(url, express.static(path.join(__dirname, 'reveal.js')));
  });
 });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

 http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
