/*	WSServer.js
	FPI, 2021-09-15
	*/

const http = require('http');
const WebSocketServer = require('websocket').server;

	
class WSServer {
	
	/*
		*/
	static log( funcName, txt, level) {
		console.log( new Date().yyyymmddhhmmsslll() + ` > WSServer > ${funcName} > ${txt}`);
	}
	
	/*	wsHttpPort: 9081 ?
		*/
	static Initialize( wsHttpPort, OnMessageHandler, OnDisconnect, callBackInitialized) {
		const funcName = "Initialize";

		WSServer.wsHttpPort = wsHttpPort;
		WSServer.OnMessageHandler = OnMessageHandler;
		WSServer.OnDisconnect = OnDisconnect;
			
		// clients wevSockets
		WSServer.connections = [ ];

		WSServer.log( funcName, "WebSocketServer http Server...", "info");
		var _webSocketHttpServer = http.createServer( function(request, response) {
			// process HTTP request. Since we're writing just WebSockets
			// server we don't have to implement anything.	
		});
				
		_webSocketHttpServer.listen( WSServer.wsHttpPort, (err) => {
			if (err) {
				WSServer.log( funcName, `_webSocketHttpServer.listen > something bad happened > ${err}`, 'warn')
				return ;
			}
			
			WSServer.log( funcName, `_webSocketHttpServer.listen > server is listening on ${WSServer.wsHttpPort}`, 'info');
			
			if (callBackInitialized) callBackInitialized(undefined);
		});
		
		// create the server
		var _wsServer = new WebSocketServer({
			httpServer: _webSocketHttpServer
		});
			
		// WebSocket server
		_wsServer.on('request', function(request) {
	
			let connection = request.accept( null, request.origin);
	
			// declare un nouveau client connecté
			let index = WSServer.connections.push( connection) - 1;
			let context = {
				indexWsClient: index,
				remoteAddress: connection.socket._peername.address,
				port: connection.socket._peername.port
			};

			WSServer.log( funcName, `_wsServer.accept new connection ${JSON.stringify( context)}`);
				
			context.connection = connection;
			
			/**/
			// This is the most important callback for us, we'll handle
			// all messages from users here.
			connection.on( 'message', function(message) {
				// WSServer.OnMessageHandler( connection, message);
				WSServer.OnMessageHandler( context, message);
			});
			
			/**/
			connection.on('close', function(connection) {
				
				// recopie
				// context.origin = connection.orign;
				
				// pour minimiser les logs
				context.connection = undefined;
				
				WSServer.log( funcName, `_wsServer.close connection ${JSON.stringify( context)}`);
				WSServer.OnDisconnect( context );
				
				// remove user from the list of connected clients
				WSServer.connections.splice( context.indexWsClient, 1);
			});
		});
	}
	
	/*
		*/
	static BroadcastToWsClients( jsnMessage) {
		const funcName = "BroadcastToWsClients";
		
		// s'il n'y a pas besoin de WSServer ou s'il n'y a aucun client
		if ( ! WSServer.connections
			|| WSServer.connections.length == 0) {
			// WSServer.log( funcName, `no client connected`, 'warn');
		} else {		
			for (let i=0; i < WSServer.connections.length; i++) {
				WSServer.BroadcastToWsClient( WSServer.connections[i], jsnMessage);
			}
		}
	}

	/*
		*/
	static BroadcastToWsClient( connection, jsnMessage) {	
		let strMsg = JSON.stringify( jsnMessage);
		connection.sendUTF(strMsg);
	}

}

module.exports = WSServer;
	
