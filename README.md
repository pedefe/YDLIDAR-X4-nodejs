# YDLIDAR-X4-nodejs
Sample of driving YDLIDAR-X4 lidar in NodeJs ;<br/>
Tested with Raspberry Pi 4 ;<br/>
You need to add external power source (5V/1A) on YDLIDAR interface board ;<br/>

This source is the translation in nodejs of lidar.py.

To use these sources, you need know a few about nodejs, in order to install yourself the necessary modules.<br/>
Look to "YDLIDAR.js" the necessary modules :<br/>
> nmp install serial<br/>
> npm install http<br/>
> npm install url<br/>
> npm install path<br/>
etc...

The module 'YDLIDAR.js' create an http server for the load of html pages (folder 'pages'); The main page 'YLIDAR-X4.html' can be accessed from browser as http://ip:9080/pages/YLIDAR-X4.html<br/>
The module 'YDLIDAR.js' create an WebSocket server, in order to exchange quickly commands and reports with web page 'YLIDAR-X4.html', mainly for the lidar acquisitions.<br/>

Warning : this is not absolutly perfect...<br/>
Remain some small problems: <br/>
- As you see on acquision picture, there are some noise in my test of room object detections...<br/>
