/* YLIDAR-X4.js
		>>> radar sur les detection du YLIDAR-X4
	MRK:
		
	*/

function YLIDAR_X4( 
	resourcePath,
	parent,
	id,
	gridMgId,
	callback) {
	
	this.id = id;
	let self = this;
	YLIDAR_X4.singleton = this;
	this.resourcePath = resourcePath;
	this.callback = callback;
	
	self.icon_close = this.resourcePath + "/medias/cross-lightblue.png";
	
	self.icon_mapNav = new Image();
	self.icon_mapNav.src = this.resourcePath + "/medias/mapNav.png";

	let content = "\
<div id='YLIDAR_X4_Win' class='myShape myRounded4 myMovingWindow myResizable' style='width: 800px; '>\
	<div id='YLIDAR_X4_Header' class='myAreaCaption'>\
		<span id='YLIDAR_X4_Header_caption' class='myAreaCaptionText'>YLIDAR-X4</span>\
		<img class='closeButton' id='YLIDAR_X4_close' src='{0}'></img>\
	</div>\
	<div id='YLIDAR_X4_Area' class='myInternal myAreaContainer' style='height: calc(100% - 26px);'>\
		<div id='YLIDAR_X4_Area_1' class='myInternalWidth' >\
			<input id='YLIDAR_X4_clearCanvas' type='button' class='roundedButton' value='clear display'></input>\
			<input id='YLIDAR_X4_port_open' type='button' class='roundedButton' value='open comm'></input>\
			<input id='YLIDAR_X4_port_scan_start' type='button' class='roundedButton' value='start scan'></input>\
			<input id='YLIDAR_X4_port_scan_stop' type='button' class='roundedButton' value='stop scan'></input>\
			<input id='YLIDAR_X4_port_close' type='button' class='roundedButton' value='close comm'></input>\
			<input id='YLIDAR_X4_health' type='button' class='roundedButton' value='health'></input>\
			<input id='YLIDAR_X4_info' type='button' class='roundedButton' value='info'></input>\
			<input id='YLIDAR_X4_endAll' type='button' class='roundedButton' value='end all'></input>\
		</div>\
		<div id='YLIDAR_X4_divCurve' class='myInternal' _style='width: 600px; height: 600px;' >\
			<canvas id='YLIDAR_X4_canCurve' class='myInternalWidth myInternalHeight' style='left: 100px; top: 10px; background-color: #d1eaee;'></canvas>\
		</div>\
	</div>\
	<div class='myResizers'>\
		<div class='myResizer bottom-right'></div>\
	</div>\
</div>".format( self.icon_close);
	
	parent.insertAdjacentHTML( 'beforeend', content);
	
	initiateWin( self, "#YLIDAR_X4_Win", "#YLIDAR_X4_Header", "#YLIDAR_X4_Header_caption", "#YLIDAR_X4_close", "#YLIDAR_X4_Area", gridMgId, this.callbackResized );
	
	this.canvas = $("#YLIDAR_X4_canCurve")[0];
	this.canvasContext = this.canvas.getContext("2d");
			
	/**/
	this.canvas.addEventListener( 'mousedown', function( event) {
		self.canvasEventClick( event);
		});
		
	this.canvas.addEventListener( 'mouseup', function( event) {
		self.canvasEventClick( event);
		});

	$("#YLIDAR_X4_clearCanvas").on( 'click', function( evt) { 
		self.drawBackground();
		});

	$("#YLIDAR_X4_port_open").on( 'click', function( evt) { 
		_WSCon.send( { destin: 'YDLIDAR_X4', cmd: 'port.open' } );
		});
		
	$("#YLIDAR_X4_port_close").on( 'click', function( evt) { 
		_WSCon.send( { destin: 'YDLIDAR_X4', cmd: 'port.close' } );
		});
		
	$("#YLIDAR_X4_port_scan_start").on( 'click', function( evt) { 
		_WSCon.send( { destin: 'YDLIDAR_X4', cmd: 'scan.start' } );
		});
		
	$("#YLIDAR_X4_port_scan_stop").on( 'click', function( evt) { 
		_WSCon.send( { destin: 'YDLIDAR_X4', cmd: 'scan.stop' } );
		});
		
	$("#YLIDAR_X4_health").on( 'click', function( evt) { 
		_WSCon.send( { destin: 'YDLIDAR_X4', cmd: 'health' } );
		});
		
	$("#YLIDAR_X4_info").on( 'click', function( evt) { 
		_WSCon.send( { destin: 'YDLIDAR_X4', cmd: 'info' } );
		});
		
	$("#YLIDAR_X4_endAll").on( 'click', function( evt) { 
		_WSCon.send( { destin: 'System', cmd: 'end' } );
		});
		
	self.scale = 1;
	self.offsetX = 0;
	self.offsetY = 0;
	}

/*
	*/
YLIDAR_X4.prototype.callbackResized = function() {
	self = YLIDAR_X4.singleton;
 	self.triggerResize();
	}
	
/*
	*/
YLIDAR_X4.prototype.triggerResize = function() {
 	this.delayedResize();
	}

YLIDAR_X4.prototype.delayedResize = function() { 

	let self = this;

	if (self.delayResizeFunc) {
		clearTimeout( self.delayResizeFunc);
		self.delayResizeFunc = undefined;
		}

	self.delayResizeFunc = setTimeout( function() { 
		let wholeHeight = parseInt( $("#YLIDAR_X4_Area")[0].getClientRects()[0].height);
		
		let divsHeight = [
			parseInt( $("#YLIDAR_X4_Area_1")[0].getClientRects()[0].height),
			];
			
		let divsWholeHeight = 0;
		divsHeight.forEach( h => { divsWholeHeight += h; });
		let newHeight = wholeHeight - divsWholeHeight - 40;
		
		let divCurve = $("#YLIDAR_X4_divCurve")[0];
		
		divCurve.style.height = newHeight + "px";
		
		self.canvas.width = divCurve.clientWidth;
		self.canvas.height = divCurve.clientHeight;
		
		self.canvas.width = divCurve.getClientRects()[0].width;
		self.canvas.height = divCurve.getClientRects()[0].height;
		}, 100);
	}
	
/*
	*/
YLIDAR_X4.prototype.canvasEventClick = function( event) {
	
	let self = YLIDAR_X4.singleton;
	
	switch( event.type) {
		case "mousedown": {
			self.canvasEventProcess( event);
			console.log(`mousedown...`);
			self.timerEventClick = setInterval( self.canvasEventProcess, 150, event);
			break;
			}
		case "mouseup": {
			console.log(`mouseup...`);
			if (self.timerEventClick) {
				clearInterval( self.timerEventClick);
				self.timerEventClick = undefined;
			}
			break;
			}
		}
	}
	
YLIDAR_X4.prototype.canvasEventProcess = function( event) {
	
 	let self = YLIDAR_X4.singleton;

	// event.layerX, event.layerY
	let partSize = self.icon_mapNav.width / 3;
	let partArray = {};
	partArray.zoomPlus = { x1: 0, y1: 0, x2: partSize-1, y2: partSize-1 };
	partArray.left = { x1: 0, y1: partSize, x2: partSize-1, y2: 2*partSize-1 };
	partArray.up = { x1: partSize, y1: 0, x2: 2*partSize-1, y2: partSize-1 };
	partArray.right = { x1: 2*partSize, y1: partSize, x2: 3*partSize-1, y2: 2*partSize-1 };
	partArray.down = { x1: partSize, y1: 2*partSize, x2: 2*partSize-1, y2: 3*partSize-1 };
	partArray.zoomMoins = { x1: 2*partSize, y1: 2*partSize, x2: 3*partSize-1, y2: 3*partSize-1 };
	
	self.drawBackground();
	
	let modified = false;
	let keys = Object.keys( partArray)
	for( let k=0; k < keys.length; k++) {
		let key = keys[ k];
		let p = partArray[ key];
		if ( event.layerX >= p.x1
			&& event.layerX <= p.x2
			&& event.layerY >= p.y1
			&& event.layerY <= p.y2) {
			modified = true;
			// console.log( key);
			switch( key) {
				case "zoomPlus": {
					
					self.scale = self.scale * 2;
					console.log(`scale: ${self.scale}`);
					self.drawBackground();
				
					break;
					}
				case "zoomMoins": {
					self.scale = self.scale / 2;
					console.log(`scale: ${self.scale}`);
					self.drawBackground();
					
					break;
					}
				case "up": {
					self.offsetY -= 10;
					self.drawBackground();
					break;
					}
				case "down": {
					self.offsetY += 10;
					self.drawBackground();
					break;
					}
				case "left": {
					self.offsetX -= 10;
					self.drawBackground();
					break;
					}
				case "right": {
					self.offsetX += 10;
					self.drawBackground();
					break;
					}
				default: {
					
					break;
					}
				}
			break;
			}
		}
		
	if (modified) {
		
		}
	}
	
/*
	*/
YLIDAR_X4.prototype.drawBackground = function() {
	let self = YLIDAR_X4.singleton;
	let ctx = self.canvasContext;
	
	ctx.resetTransform();
	ctx.clearRect( 0, 0, self.canvas.width, self.canvas.height);
	ctx.drawImage( self.icon_mapNav, 0, 0);
	
	ctx.translate( self.offsetX, self.offsetY);
	
	ctx.scale( self.scale, self.scale);
	
	// ctx.translate( self.canvas.width/2, self.canvas.height/2);
	
	ctx.strokeStyle = '#0000ff';
	ctx.lineWidth = 0.5;
	for( let r = 100; r < 1200; r += 100) {		
		ctx.beginPath();
		ctx.arc( self.canvas.width / 2, self.canvas.height / 2, r, 0, 2 * Math.PI, true);
		ctx.stroke();
		}
	}
	
/*
	*/
YLIDAR_X4.prototype.receiveDetections = function( commMsg) {
	let self = YLIDAR_X4.singleton;
	let ctx = self.canvasContext;
	
	console.log( JSON.stringify( commMsg.detections));
	
	self.drawBackground();
	
	ctx.strokeStyle = '#ff0000';
	let refX = self.canvas.width / 2;
	let refY = self.canvas.height / 2;
	Object.keys( commMsg.detections).forEach( key => {
		
		let item = commMsg.detections[ key];
		
		ctx.beginPath();
		// item: { angle, distance }
		let theta = item.angle * (Math.PI/180);
		let distance = item.measures[0];
		let x = refX + (distance  * Math.cos(theta)) / 10;
		let y = refY + (distance * Math.sin(theta)) / 10;
		
		// ctx.arc( x, y, 0.1, 0, 2 * Math.PI, false);
		ctx.fillRect( x-1, y-1, 3, 3);
		ctx.stroke();
		
		/*ctx.beginPath();
		// item: { angle, distance }
		let theta = item.angle * (Math.PI/180);
		ctx.moveTo( refX, refY);
		
		let x = refX + (item.distance  * Math.cos(theta)) / 10;
		let y = refY + (item.distance * Math.sin(theta)) / 10;
		ctx.lineTo( x, y);
		ctx.stroke();*/
		
		});
	}