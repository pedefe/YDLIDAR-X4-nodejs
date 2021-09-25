/*	HttpServer.js
	FPI, 2021-09-15
	*/

const http = require('http');

	
class HttpServer {

	/*
		*/
	static log( funcName, txt, level) {
		console.log( new Date().yyyymmddhhmmsslll() + ` > HttpServer > ${funcName} > ${txt}`);
	}
	
	/*
	*/
	static Initialize( httpRequestHandler, callBackInitialized) {
		const funcName = "Initialize";

		let logDebug = false;
		
		HttpServer.httpPort = 9080;
		
		HttpServer.log( funcName, `start http server on ${HttpServer.httpPort}...`, "info");
		let httpServer = http.createServer( httpRequestHandler);
		
		httpServer.listen( HttpServer.httpPort, (err) => {
			if (err) {
				HttpServer.log( funcName, `listen > something bad happened > ${err}`, 'warn');
				// console.debug( `listen > something bad happened > ${err}`);
				return;
			}
	
			HttpServer.log( funcName, "listen > server is listening", 'info');
			
			if (callBackInitialized) callBackInitialized(undefined);
		});

		HttpServer.sockets = {};
		HttpServer.nextSocketId = 0;
		httpServer.on( 'connection', function( socket) {

			// Add a newly connected socket
			HttpServer.nextSocketId ++;
			let socketId = HttpServer.nextSocketId;
			HttpServer.sockets[ socketId] = socket;
			if (logDebug) 
				HttpServer.log( funcName, `on connection > socket ${socketId} opened`, 'info');

			// Remove the socket when it closes
			socket.on( 'close', function () {
				
				if (logDebug) 
					HttpServer.log( funcName, ` on close > socket ${socketId} closed`, 'info');

				delete HttpServer.sockets[ socketId];
			});
		});
	}
}

module.exports = HttpServer;
