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
Each presesntation folder has a specific template that must be followed. See 

I have a ( very slightly) modified version of the master reveal.js repo forked here. https://github.com/liamog/reveal.js
You must use this version and it must be located in the reveal.js subfolder of this repo. 

Usage. 
  node app.js

defaults right now to serving on 3000. 

http://localhost/<presentationdir> 
http://localhost/<presentationdir>/attendee
http://localhost/<presentationdir>/presenter 



Todo/issues
-----------
There is a hack currently checked in where the production and default websocket urls are hardcoded. I need to move this out to a config setting
The reason is that in my setup my server sits behind a nginx reverse proxy with the https://github.com/yaoweibin/nginx_tcp_proxy_module
This currently has a limitation that the public facing websocket port cannot be the same as the http server.
(However they are the same port on the node.js server). 

For now you can modify this manually but this will be fixed. 

Controller is non functional at the moment. 




