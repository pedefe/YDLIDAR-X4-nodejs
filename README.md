# YDLIDAR-X4-nodejs
Sample of driving YDLIDAR-X4 in nodejs

This source is the translation in nodejs of lidar.py.

To use these sources, you need know a few about nodejs, in order to install yourself the necessary modules.
Look to "YDLIDAR.js" the necessary modules :
> nmp install serial
> npm install http
> npm install url
> npm install path
etc...

The module create an http server for the load of html pages;
The module create an WebSocket server, in order to exchange quickly commands and reports, mainly for the lidar acquisitions.

Warning :
this is not perfect... ;)
- there are some checksum error in the data acquisition...
- As you see on acquision picture, there are some noise in my test of room object detections...
