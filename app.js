
/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path')
 , dust = require('dustjs-linkedin')
 , presentations= require('./presentations.js')
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
  // setup our route per presentation found
  presentations.watch(path.join(__dirname, 'presentations'), function(presentation){
    app.all(presentation.url, function(req, res) { res.redirect(presentation.url + '/'); });
    app.get(presentation.url +'/' , function(req, res){
      dust.render("reveal", presentation, function(err,out){
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', out.length);
        res.end(out);
      });
    });
    app.use(presentation.url, express.static(presentation.path));
    app.use(presentation.url, express.static(path.join(__dirname, 'reveal.js')));
  })

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app);
var io =  require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



io.sockets.on('connection', function(socket) {
  console.log("socket connected");
  socket.on('fragmenthidden', function(data) {
    socket.broadcast.emit('fragmenthidden', data);
    console.log("fragmenthidden - data=");
    console.log(data);
  });

  socket.on('fragmentshown', function(data) {
    socket.broadcast.emit('fragmentshown', data);
    console.log("fragmentshown - data=");
    console.log(data);
  });

  socket.on('slidechanged', function(slideData) {
    socket.broadcast.emit('slidedata', slideData);
    console.log("slidechanged - data=");
    console.log(slideData);
  });

  socket.on('reload', function(slideData) {
    socket.broadcast.emit('reload', slideData);
    console.log("reload - data=");
    console.log(slideData);
  });

  socket.on('controller', function(command) {
    socket.broadcast.emit('controller', command);
    console.log("controller - data=");
    console.log(command);
  });
});
