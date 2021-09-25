/*	BehaviorView.js
	*/
	
function BehaviorView(
	resourcePath,
	parent,
	id,
	gridMgId,
	callback) {
			
	this.id = id;
	let self = this;
	BehaviorView.singleton = this;
	this.resourcePath = resourcePath;
	this.callback = callback;
	
	let icon_close = this.resourcePath + '/medias/cross-lightblue.png';

	let content = "\
<div id='BehaviorView_Win' class='myShape myRounded4 myMovingWindow myResizable' style='width: 510px; height: 610px;'>\
	<div id='BehaviorView_Header' class='myAreaCaption'>\
		<span id='BehaviorView_Header_caption' class='myAreaCaptionText'>Behavior</span>\
		<img class='closeButton' id='BehaviorView_close' src='{0}'></img>\
	</div>\
	<div id='BehaviorView_Area' class='myInternal myAreaContainer' style='height: calc(100% - 26px);'>\
		<div class='myBorderUD' style='width: 100%; height: 33px;'>\
			<input id='BehaviorView_btnMvtClear' type='button' class='roundedButton' value='clear'></input>\
		</div>\
		<div id='BehaviorView_canvasArea' class='myBorderAll myInternalWidth' style='height: 500px;'>\
			<canvas id='BehaviorView_canvas' class='myBorderAll myInternal'></canvas>\
		</div>\
		<div class='myInternalWidth'>\
			<span class='myRoundedSpan' style='width: calc(100% - 10px);'>\
				<label class='myStdFont stdBold'>Step:</label>\
				<label id='BehaviorView_mvtStep'  class='myStdFont'>?</label>\
				<label class='myStdFont stdBold'>Distance:</label>\
				<label id='BehaviorView_mvtStepDistance'  class='myStdFont'>?</label>\
			</span>\
		</div>\
		<div class='myInternalWidth'>\
			<span class='myRoundedSpan' style='width: calc(100% - 10px);'>\
				<label id='BehaviorView_mvtCanTip' class='myStdFont'>?</label>\
			</span>\
		</div>\
	</div>\
	<div class='myResizers'>\
		<div class='myResizer bottom-right'></div>\
	</div>\
</div>".format( icon_close);
	
	parent.insertAdjacentHTML( 'beforeend', content);
	
	initiateWin( self, '#BehaviorView_Win', '#BehaviorView_Header', '#BehaviorView_Header_caption', '#BehaviorView_close', '#BehaviorView_Area', gridMgId );
	setDynamicArea( 'BehaviorView_canvasArea', 'BehaviorView_canvas');
	
	self.mvtX = -1;
	self.mvtY = -1;
	self.mvtLastSpeed = undefined;
	
	self.mvtLastJsn = null;
	self.mvtJsnArray = [];
	self.mvtLastStep = null;

	self.mvtCanvas = $('#BehaviorView_canvas')[0];
	self.mvtCanContext = self.mvtCanvas.getContext('2d');
	/*self.canvas = $('#BehaviorView_canvas')[0];
	self.context = self.canvas.getContext('2d');*/
	
	self.mvtCanvas.addEventListener( 'mousemove', BehaviorView.mvtCanvasOnMouseMove, false);
	
	$('#BehaviorView_btnMvtClear').on( 'click', function( evt) {
		self.clearMvtDraw();
		});
	}
	
/*
	*/
BehaviorView.prototype.sizeEx = function() {
	let self = BehaviorView.singleton;
	self.delayedResize();
	}
	
BehaviorView.prototype.triggerResize = function() {
	let self = BehaviorView.singleton;
	self.delayedResize();
	}

BehaviorView.prototype.delayedResize = function() { 

	let self = BehaviorView.singleton;

	if (self.delayResizeFunc) {
		clearTimeout( self.delayResizeFunc);
		self.delayResizeFunc = undefined;
		}

	self.delayResizeFunc = setTimeout( function() { 
		let crAreaHeight =  parseInt( $('#BehaviorView_canvasArea')[0].getClientRects()[0].height);
		let crAreaWidth =  parseInt( $('#BehaviorView_canvasArea')[0].getClientRects()[0].width);
				
		$('#BehaviorView_canvas')[0].height = crAreaHeight;
		$('#BehaviorView_canvas')[0].width = crAreaWidth;
		}, 100);
	}
			
/*
	*/
BehaviorView.prototype.mvtCanvasOnMouseMove = function( event) {

	let self = BehaviorView.singleton;
	
	let x = event.offsetX;
	let y = event.offsetY;
	$('#BehaviorView_mvtCanTip')[0].innerText = '';
	_mvtJsnArray.every( function( jsn) {
		if (jsn.x == x && jsn.y == y) {
			let averageSpeed = (jsn.speedL + jsn.speedR) / 2;
			$('#BehaviorView_mvtCanTip')[0].innerText = `action=${jsn.action}, speed=${averageSpeed}, obstacle=${jsn.distance} cm`;
			return false;
			}
		else return true;
		});
	}

/*
	*/
BehaviorView.prototype.clearMvtDraw = function() {

	let self = BehaviorView.singleton;

	self.mvtLastJsn = null;
	self.mvtJsnArray = [];
	self.mvtCanContext.closePath();
	self.mvtCanContext.clearRect( 0, 0, self.mvtCanvas.width, self.mvtCanvas.height);
	self.mvtX = self.mvtCanvas.width / 2;
	self.mvtY = self.mvtCanvas.height / 2;
	}
/*
	*/
BehaviorView.prototype.addMvtPoint = function( jsnData) {

	let self = BehaviorView.singleton;

	try {
		let scaleTimeToPx = 0.1;
		
		if (self.mvtLastJsn != null) {
			
			let averageSpeed = (jsnData.speedL + jsnData.speedR) / 2;
			console.log( `BehaviorView.addMvtPoint > averageSpeed: ${averageSpeed}`);
			if (self.mvtLastSpeed == undefined) self.mvtLastSpeed = averageSpeed;
			if (Math.sign( averageSpeed) != Math.sign( self.mvtCanContext)) {
				self.mvtCanContext.closePath();
				self.mvtCanContext.beginPath();
				self.mvtCanContext.moveTo( self.mvtX, self.mvtY);
				}
			if (averageSpeed >= 0) {
				self.mvtCanContext.strokeStyle = 'green';
				}
			else {
				self.mvtCanContext.strokeStyle = 'red';
				}
				
			if (Math.sign( jsnData.speedL) == Math.sign( jsnData.speedR) && Math.sign( jsnData.speedL) == 1) {
				jsnData.action = 'roll straight';
				}
			else if (Math.sign( jsnData.speedL) == Math.sign( jsnData.speedR) && Math.sign( jsnData.speedL) == -1) {
				jsnData.action = 'roll back';
				}
			else if (Math.sign( jsnData.speedL) != Math.sign( jsnData.speedR) && Math.sign( jsnData.speedL) == 1) {
				jsnData.action = 'turn right';
				}
			else if (Math.sign( jsnData.speedL) != Math.sign( jsnData.speedR) && Math.sign( jsnData.speedL) == -1) {
				jsnData.action = 'turn left';
				}
			else {
				jsnData.action = '?';
				console.log( 'addMvtPoint > unknown action');
				}
				
			let deltaT = new Date( jsnData.stamp).getTime() -  new Date( self.mvtLastJsn.stamp).getTime();
			let traveledTime = averageSpeed * (deltaT * scaleTimeToPx);
			
			let offsetX = (traveledTime/1000) * Math.cos( jsnData.heading * (Math.PI / 180));
			let offsetY = (traveledTime/1000) * Math.sin( jsnData.heading * (Math.PI / 180));
			
			let x2 = Math.round( self.mvtX - 2 * offsetX);
			let y2 = Math.round( self.mvtY - 2 * offsetY);
			self.mvtCanContext.lineTo( x2, y2);
			
			self.mvtCanContext.stroke();
			
			self.mvtX = x2;
			self.mvtY = y2;
			self.mvtLastSpeed = averageSpeed;
			console.log(`x=${self.mvtX}, y=${self.mvtY}`);
			}
		else {
			self.mvtCanContext.beginPath();
			self.mvtCanContext.lineWidth = 1;
			self.mvtCanContext.moveTo( self.mvtX, self.mvtY);
			// self.mvtCanContext.stroke();
			console.log(`x=${self.mvtX}, y=${self.mvtY}`);
			}				
		}
	catch( err) {
		console.log( `BehaviorView.addMvtPoint > err: ${err}`);
		}
	
	// distance parcourue entre le début et la fin du mouvement
	if (jsnData.step) {	
		$('#BehaviorView_mvtStep')[0].innerText = jsnData.step;
		
		if (jsnData.step == 'record.start') {
			self.clearMvtDraw();
			}
			
		if (jsnData.step.startsWith( 'move.front.')
				&& jsnData.step.endsWith( '.start') ) {
			self.mvtLastStep = jsnData;
			}
		
		if (jsnData.step.startsWith( 'move.front.')
			&& ( jsnData.step.endsWith( '.stop') || jsnData.step.endsWith( '.abort') ) ) {
			
			let mainStep = jsnData.step;
			mainStep = mainStep.replace( '.abort', '');
			mainStep = mainStep.replace( '.stop', '');
			
			if (self.mvtLastStep.step.startsWith( mainStep)
				&& self.mvtLastStep.step == (mainStep + '.start') ) {
				let deltaDistance = self.mvtLastStep.distance - jsnData.distance;
				$('#BehaviorView_mvtStepDistance')[0].innerText = deltaDistance;
				
				let radius = Math.sqrt( Math.pow(self.mvtLastStep.x - self.mvtX, 2) + Math.pow(self.mvtLastStep.y - self.mvtY, 2));
				
				//self.mvtCanContext.moveTo( self.mvtLastStep.x, self.mvtLastStep.y);
				self.mvtCanContext.arc( self.mvtLastStep.x, self.mvtLastStep.y, radius, 0, 2*Math.PI);
				self.mvtCanContext.stroke();
				}
			}
		}
	
	self.mvtLastJsn = jsnData;
	self.mvtLastJsn.x = self.mvtX;
	self.mvtLastJsn.y = self.mvtY;
	self.mvtJsnArray.push( self.mvtLastJsn);
	}