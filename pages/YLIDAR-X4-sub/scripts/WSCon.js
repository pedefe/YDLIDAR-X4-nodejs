/*	WSCon.js
	*/
	
function WSCon(
	callbackEvent) {
	
	WSCon.singleton = this;
	this.callbackEvent = callbackEvent;
	this.host = window.location.hostname;
	this.hostPort = 9081;
	this.wsUri = "ws://{0}:{1}/automove".format( this.host, this.hostPort); 
	this.ws = null;
	
	this.conStart = null;
	this.conEnd = null;
	this.durations = [];
	this.messageCount = 0;
	}
	
/*
	*/
WSCon.prototype.start = function() {
	setTimeout( this.reconnect, 10);
	}	
	
WSCon.prototype.ping = function( ip, callback) {

	if (!this.inUse) {
		this.status = 'unchecked';
		this.inUse = true;
		this.callback = callback;
		this.ip = ip;
		let _that = this;
		this.img = new Image();
		this.img.onload = function () {
			_that.inUse = false;
			_that.callback('responded', true);
			};
		this.img.onerror = function (e) {
			if (_that.inUse) {
				_that.inUse = false;
				_that.callback('responded', true, e);
				}
			};
		this.start = new Date().getTime();
		this.img.src = `http://${ip}:9080/bidon.png` ;
		this.timer = setTimeout(function () {
			if (_that.inUse) {
				_that.inUse = false;
				_that.callback('timeout', false);
				}
		}, 5000);
	}
}

/*
	*/
WSCon.prototype.reconnect = function( event) {

	let self = WSCon.singleton;
	
	do {
		try {
			let r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
			let ip = self.wsUri.match( r);
			
			if (ip
				&& ip.length == 1) {
				let p = new self.ping( ip[0], function( report, available, error) {
						
					if (available) {
						try {		
							self.ws = new WebSocket( self.wsUri);
							} 
						catch( err) {
							console.log( `new WebSocket > ${err}`);
							}
						
						if (self.ws) {
							self.messageCount = 0;
							self.ws.binaryType = 'arraybuffer';

							self.ws.onopen = self.wsOnOpen;
							self.ws.onclose = self.wsOnClose;
							self.ws.onmessage = self.wsOnMessage;
							self.ws.onerror = self.wsOnError;
							}
						}
					else {
						setTimeout( self.reconnect, 1000);
						}
					});
				}
			} 
		catch( err) {
			console.log( `new WebSocket > unable to access ip`);
			}

		}
	while( false);
	}
	
/*
WSCon.prototype.reconnect = function( event) {

	let self = WSCon.singleton;
	
	do {
		try {		
			self.ws = new WebSocket( self.wsUri);
			} 
		catch( err) {
			console.log( `new WebSocket > ${err}`);
			}
		
		if (self.ws) {
			self.messageCount = 0;
			self.ws.binaryType = 'arraybuffer';

			self.ws.onopen = self.wsOnOpen;
			self.ws.onclose = self.wsOnClose;
			self.ws.onmessage = self.wsOnMessage;
			self.ws.onerror = self.wsOnError;
			}
		}
	while( false);
	}*/
	
WSCon.prototype.send = function( jsn) {
	if (this.ws != null) {
		this.ws.send( JSON.stringify( jsn));
		}
	else {
		let a = 1;
		a += 1;
		}
	}
	
WSCon.prototype.wsOnOpen = function( evt) {
	
	let self = WSCon.singleton;
	
	self.conStart = new Date(); 

	self.callbackEvent( { commEvent: "connection", start: self.conStart } );
		
	self.conEnd = null;
	
	self.messageCount = 0;
	}
	
/*
	*/
WSCon.prototype.wsOnClose = function( evt) {

	let self = WSCon.singleton;
	
	self.conEnd = new Date(); 
	
	if (self.conStart) {
		self.callbackEvent( { commEvent: "disconnection", start: self.conStart, end: self.conEnd, messageCount: self.messageCount } );
		let duration = (self.conEnd.getTime() - self.conStart.getTime()) / 1000;
		self.durations.push( { start: self.conStart, end: self.conEnd, duration: duration } );
		}
	
	self.ws = null;
	
	setTimeout( self.reconnect, 1000);
	}
	
	
/*
	*/
WSCon.prototype.wsOnError = function( evt) {
	let self = WSCon.singleton;
	}
	
/*
	*/
WSCon.prototype.wsOnMessage = function( evt) {
	
	let self = WSCon.singleton;
	self.messageCount ++;
	// MAJORCHANGE > setTimeout( self.callbackEvent, 20, { event: "reception", data: JSON.parse( evt.data) } );
	setTimeout( self.callbackEvent, 20, { commEvent: "reception", commMsg: JSON.parse( evt.data) } );
	}
