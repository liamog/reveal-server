
/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path')
 , presentations= require('./presentations.js')
 , mustache = require('mustache')
 , _ = require('underscore')
 , fs = require('fs');

 var app = express();
 var env = process.env.NODE_ENV || 'dev';

 var isProduction = (env == "production");

 var config = JSON.parse(fs.readFileSync(path.join(__dirname, isProduction ? "config_production.json": "config_dev.json")));

 console.log("config is " + JSON.stringify(config));

 app.configure(function(){
  var template = path.join(__dirname, 'reveal.js', 'reveal_template.html');
  var controller = path.join(__dirname, 'controller_phone.html');
  var presenter_script = fs.readFileSync(path.join(__dirname, 'presenter_client.html'), 'utf8');
  var attendee_script = fs.readFileSync(path.join(__dirname, 'attendee_client.html'), 'utf8');

  app.enable('strict routing');
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // setup our route per presentation found
  presentations.watch(path.join(__dirname, 'presentations'), function(presentation){
    // foreach of the presentations we find in our folder. 

    // Redirect to deal with no trailing slash
    app.all(presentation.url, function(req, res) { res.redirect(presentation.url + '/'); });
    app.all(presentation.url + '/attendee', function(req, res) { res.redirect(presentation.url + '/attendee/'); });
    app.all(presentation.url + '/presenter', function(req, res) { res.redirect(presentation.url + '/presenter/'); });
    app.all(presentation.url + '/controller', function(req, res) { res.redirect(presentation.url + '/controller/'); });
    
    // standalone presentation
    createRoute(app, presentation, template);

    // attendee
    var attendee = _.clone(presentation);
    attendee.url = presentation.url + '/attendee'
    attendee.extrascript=  expandClientScript(attendee_script, presentation);
    attendee.controls = false;
    attendee.keyboard = false;
    createRoute(app, attendee, template);

    //presenter
    var presenter = _.clone(presentation);
    presenter.url = presentation.url + '/presenter'
    presenter.extrascript=  expandClientScript(presenter_script, presentation);
    createRoute(app, presenter, template);
    
    presentationWebSocketState(presentation);
    app.use(presentation.url, express.static(presentation.path));

    app.get(presentation.url + '/controller/', function(req,res){
      fs.readFile(controller, function(err, data) {
        res.setHeader('Content-Type', 'text/html');
        res.send(mustache.to_html(expandClientScript(data.toString(), presentation), presentation));
      });
    });

  })
  // Expose this site's public folder for misc items
  app.use("/", express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app);
var io =  require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function expandClientScript(script, presentation)
{
  if(isProduction)
    return mustache.to_html(script, {socketurl : "http://logorman-revealjs:8888" + presentation.url});
  else // TODO: hmm how to make this more configurable - read from a .json file I guess.
    return mustache.to_html(script, {socketurl : "http://localhost:3000" + presentation.url});
}

function createRoute(app, presentation, template){
  app.get(presentation.url + '/' , function(req, res){
    fs.readFile(template, function(err, data) {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control: max-age=1, must-revalidate')
      res.send(mustache.to_html(data.toString(), presentation));
    });
  });
  app.use(presentation.url + '/', express.static(presentation.path));
  app.use(presentation.url + '/', express.static(path.join(__dirname, 'reveal.js')));
}

function presentationWebSocketState(presentation)
{
  console.log('setting up socket for url ' + presentation.url);
  io.of(presentation.url).currentSlideData = {h:0, v:0, f:0};
  io.of(presentation.url).on('connection', function(socket) {
    
    console.log("******  socket connected for presentation " + presentation.name);
    socket.emit("slidedata", io.of(presentation.url).currentSlideData);
    
    socket.on('slidechanged', function(slideData) {
      io.of(presentation.url).currentSlideData = slideData;
      socket.broadcast.emit('slidedata', slideData);
      console.log("slidechanged - data=");
      console.log(slideData);
    });

    socket.on('controller', function(command) {
      socket.broadcast.emit('controller', command);
      console.log("controller - data=");
      console.log(command);
    });
  });
}
