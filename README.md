reveal-server
=============

Node based Presentation Server for sharing Reveal.js presentations. 

Features
* Serve multiple presentations from subfolders, auto configured by enumerating subfolders.
* Standalone view
* Presenter view - drives the presentation
* Attendee view - auto follows the presenter
* Controller - designed to be used from a phone , remotely control the presenter
* Can overide title, theme and reveal.js settings per presentation

Simplifies the process of creating new presentations.

Setup
-----

After cloning to the folder of your choice, create a subfolder ( or link to ) for each presentation you wish to serve.
Each presesntation folder has a specific template that must be followed. See https://github.com/liamog/reveal.js-template
TODO - make this a submodule

I have a ( very slightly) modified version of the master reveal.js repo forked here. https://github.com/liamog/reveal.js
You must use this version and it must be located in the reveal.js subfolder of this repo. 
TODO - make this a submodule

Usage
-----
     node app.js

defaults right now to serving on port 3000. 
 
     http://localhost/<presentationdir> 
     http://localhost/<presentationdir>/attendee
     http://localhost/<presentationdir>/presenter 

Configuration
-------------
     prodcution_config.json
     config.json 

 Currently the only setting is an override for the websocket port number. 

     {
          "websocketurl": ":8888"
     }

The reason is that in my setup my server sits behind a nginx reverse proxy with the https://github.com/yaoweibin/nginx_tcp_proxy_module
This currently has a limitation that the public facing websocket port cannot be the same as the http server.
(However they are the same port on the node.js server). 

                              
Todo/issues
-----------
Controller is non functional at the moment. 

Future
------
* Add a home page with links to presentations



