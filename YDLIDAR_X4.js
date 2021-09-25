/*	YDLIDAR_X4.js
	FPI, 2021-09-22
	Translated from "lidar.py"
	*/
	
const WSServer = require('./WSServer');
const HttpServer = require('./HttpServer');
const url = require('url');
const path = require('path');
const fs = require('fs');
	
/*
	*/
Date.prototype.yyyymmddhhmmsslll = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	var lll = this.getMilliseconds() < 10 ? "00" + this.getMilliseconds() : 
		this.getMilliseconds() < 100 ? "0" + this.getMilliseconds() :
		this.getMilliseconds();
	return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss + '.' + lll;
};

/**/
function hasSubArray(master, sub) {
	/*return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));*/
	// Two pointers to traverse the arrays
	let i = 0, j = 0;
	let n = master.length;
	let m = sub.length;
	// Traverse both arrays simultaneously
	while (i < n && j < m) {
			// If element matches
			// increment both pointers
			if (master[i] == sub[j]) {
				i++;
				j++;
				// If array B is completely
				// traversed
				if (j == m) {
					return true;
				}
			}
			// If not,
			// increment i and reset j
			else {
				i = i - j + 1;
				j = 0;
			}
	}

	return false;
}

/**/
function findSubArray(master, sub, fromPos) {
	let i =  fromPos >>> 0;
	let sl = sub.length;
	let l = master.length + 1 - sl;

	loop: for (; i < l; i++) {
		for( let j=0; j < sl; j++) {
			if (master[i+j] !== sub[ j]) {
				continue loop;
			}
			return i;
		}
	}
	return -1;
}

/**/
function log(txt) {
	console.log( new Date().yyyymmddhhmmsslll() + ` > YLIDAR_X4 > ${txt}`);
}

function exitHandler( options, exitCode) {
	if (lidarDevice.thePort) {
		lidarDevice.thePort.close();
	}
	process.exit(exitCode);
}

process.on( 'SIGINT', exitHandler.bind( null, { exit: true}) ); 
process.on( 'SIGUSR1', exitHandler.bind( null, { exit: true}) ); 
process.on( 'SIGUSR2', exitHandler.bind( null, { exit: true}) ); 

const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

log( "YLIDAR_X4 Starts...");

/**/
function isLinux() {
	return process.platform === "linux";
}

/**/
function isWindows() {
	return process.platform === "win32";
}

const AsyncQueue = require('./AsyncQueue');
log( "AsyncQueue loaded...");
var _queueLidarCmd = new AsyncQueue(5);

var SerialPort = null;
if (isLinux()) {
	SerialPort = require('serialport');
	log( "Linux serialport loaded");
}

if (isWindows()) {
	SerialPort = require('serialport');
	log( "Windows serialport loaded");
}

var lidarDevice = {
	sPort: isWindows() ? "COM3" : "/dev/ttyUSB0",
	thePort: null,
	lidarBuffer: Buffer.from( []),
	detections: {},
	currentCmd: null,
	clear: false
}

lidar_on_open = function(err) {
	log('port is open.');
} 

lidar_on_error = function(err) {
	log('Error: ' + err.message);
}

lidar_on_close = function(err) {
	log('port is closed > err: ' + JSON.stringify( err));
	lidarDevice.thePort = null;
}

lidar_on_data = function( data) {
	processLidarAnswer( data);
}

/*
 */
function queueLidarCmdSend( params) {
	_queueLidarCmd.add( lidarCommand, params ).then( result => {
		log( `queue.add > reported > result: ${JSON.stringify(result)}`);
	});
}


var lidarCommand = ( params) => new Promise( resolve => {
	
	lidarDevice.thePort.write( params.frame);
	
	resolve( { err: undefined, result: { stamp: new Date(), params: params } } );
});

function HexArrToDec( block) {
	let littleEndianVal = 0;
	for( let i=0; i < block.length; i++) { 
		littleEndianVal = littleEndianVal + block[ i] * Math.pow( 256, i);
	}
	return littleEndianVal;
}

function computeChecksum( block) {
	let isValid = false;
	try {
		let ocs = HexArrToDec( [ block[6], block[7] ] );
		let LSN = block[ 1];
		let cs = 0x55AA ^ HexArrToDec( [ block[0], block[1] ] ) ^ HexArrToDec( [block[2], block[3] ] ) ^ HexArrToDec( [block[4], block[5] ] );
		for( let i = 0; i < 2 * LSN; i+= 2) {
			cs = cs ^ HexArrToDec( [ block[ 8+i], block[ 8+i+1] ] );
		}
		if(cs == ocs) {
			isValid = true;
		} else {
			isValid = false;
		}
	} catch( err) {
		//nop
	}
	return isValid;
}

/*
 */
function AngleCorr( dist) {
	const funcName = "AngleCorr";
	
	let angleDegree = 0;
	
	if (dist == 0) {
		// nop
	} else {
		//let angleRadians = Math.atan2( 21.8 * ((155.3 - dist), (155.3 * dist)));
		let angleRadians = Math.atan( 21.8 * ( (155.3 - dist) / (155.3 * dist) ) );
		// log(`${funcName} > dist: ${dist}, angleRadians: ${angleRadians}`);
		
		if (angleRadians < 0) {
			angleRadians = 2 * Math.PI + angleRadians;
		}
		angleDegree = parseFloat( (angleRadians * 180) / Math.PI);
	}
	return angleDegree;
}

/*
	*/
function computeMean( arr) {
	if ( ! arr
		|| arr.length == 0) {
			return 0;
	} else {
		let sum = arr.reduce( function( a, b) {
        return a + b;
    }, 0);
		return sum / arr.length;
	}
}
				
/*
 */
function convertBlock( block) {
	const funcName = "convertBlock";
	
	let dbg = false;
	
	if (dbg) log(`${funcName} > begin...block.len: ${block.length}`);
	
	let ddict = [];
	let LSN = block[1];
	
	if (dbg) log(`${funcName} > LSN: ${LSN}...`);
	
	if (dbg) log(`${funcName} > fsa > 2..3: ${HexArrToDec( [block[2], block[3] ] )}`);
	if (dbg) log(`${funcName} > fsa > 8..9: ${HexArrToDec( [block[8], block[9] ] )}`);
	let dist1 = HexArrToDec( [block[ 8], block[ 9] ] ) / 4;
	if (dbg) log(`${funcName} > fsa > HexArrToDec( [block[ 8], block[ 9] ] ) / 4 > dist1: ${dist1}`);
	if (dbg) log(`${funcName} > fsa > AngleCorr( dist1) : ${AngleCorr( dist1)}`);
	
	let Angle_fsa = ( (HexArrToDec( [block[2], block[3] ] ) >> 1) / 64.0) + AngleCorr( HexArrToDec( [block[ 8], block[ 9] ] ) / 4);
	if (dbg) log(`${funcName} > Angle_fsa: ${Angle_fsa}...`);
	
	
	if (dbg) log(`${funcName} > lsa > block[4]: ${block[4]}, block[5]: ${block[5]}, [4..5]: ${HexArrToDec( [block[4], block[5] ] )}`);
	
	if (dbg) log(`${funcName} > lsa > LSN*2 + 6: ${LSN*2 + 6}, block[ LSN*2 + 6]: ${block[ LSN*2 + 6]}`);
	if (dbg) log(`${funcName} > lsa > LSN*2 + 7: ${LSN*2 + 7}, block[ LSN*2 + 7]: ${block[ LSN*2 + 7]}`);
	if (dbg) log(`${funcName} > lsa > [LSN*2 + 6..LSN*2 + 7]: ${HexArrToDec( [block[ LSN*2 + 6], block[ LSN*2 + 7] ] )}`);
	let dist2 = HexArrToDec( [block[ LSN*2 + 6], block[ LSN*2 + 7] ] ) / 4;
	if (dbg) log(`${funcName} > lsa >  HexArrToDec( [block[ LSN*2 + 6], block[ LSN*2 + 7] ] ) / 4 > dist2: ${dist2}`);
	if (dbg) log(`${funcName} > lsa > AngleCorr( dist2) : ${AngleCorr( dist2)}`);
	let Angle_lsa = ( (HexArrToDec( [block[4], block[5] ] ) >> 1) / 64.0) + AngleCorr( HexArrToDec( [block[ LSN*2 + 6], block[ LSN*2 + 7] ] ) / 4);
	if (dbg) log(`${funcName} > Angle_lsa: ${Angle_lsa}...`);
	
	let Angle_diff = 0;
	if (Angle_fsa < Angle_lsa) {
		Angle_diff = Angle_lsa - Angle_fsa;
	} else {
		Angle_diff = 360 + Angle_lsa - Angle_fsa;
	}
	if (dbg) log(`${funcName} > Angle_diff: ${Angle_diff}...`);
	for (let i = 0; i < 2 * LSN; i += 2) {
		
		let dist_i = HexArrToDec( [block[8+i],block[8+i+1]]) / 4;
		// let Angle_i_tmp = ( ( Angle_diff / parseFloat( LSN) ) * (i/2)) + Angle_fsa + AngleCorr( dist_i);
		let Angle_i_tmp = ( ( Angle_diff / parseFloat( LSN-1) ) * ((i/2)-1)) + Angle_fsa + AngleCorr( dist_i);
		
		/*let Angle_i;
		if (Angle_i_tmp > 360) {
			Angle_i = Angle_i_tmp - 360
		} else if (Angle_i_tmp < 0) {
			Angle_i = Angle_i_tmp + 360;
		} else {
			Angle_i = Angle_i_tmp;
		}*/
		let Angle_i = Angle_i_tmp % 360;
		if (Angle_i < 0) {
			Angle_i += 360;
		}
		// log(`${funcName} > Angle_i: ${Angle_i}...`);
		ddict.push( { angle: Angle_i, distance: dist_i } );
	}
	return ddict;
}
	
/*
	*/
function processLidarAnswer( data) {
	const funcName = "processLidarAnswer";
	
	// log( `${funcName} > begin...currentCmd: ${lidarDevice.currentCmd}`);
	
	// log( `data type: ${typeof data}`);
	// log( `received data: ${data.toString()}, utf8: : ${data.toString("utf8")}, hex: ${data.toString("hex")}`);
	let buf = Buffer.from( data, 'utf-8');
	
	/*let strHex = "";
	buf.forEach( b => { 
		strHex += "0x" + b.toString(16).toUpperCase() + " "; 
	});
	log( `${funcName} > len: ${buf.length}, strHex: ${strHex}`);*/
	
	if (lidarDevice.currentCmd != null) {
		lidarDevice.lidarBuffer = Buffer.concat( [ Buffer.from( lidarDevice.lidarBuffer), buf]);
	} else {

		log( `${funcName} > !!!! data received out of command > len: ${buf.length} > purged`);
		// lidarDevice.lidarBuffer = Buffer.from( []);
	}
	
	let bufferProcessed = false;
	while( ! bufferProcessed) {
		
		// get info : 27 bytes
		if (hasSubArray( lidarDevice.lidarBuffer, [0xA5, 0x5A, 0x14, 0x00, 0x00, 0x00 ])) {
			log(`${funcName} > recognize 'info'...`);
			if (lidarDevice.currentCmd == "info") {
				let pos = findSubArray( lidarDevice.lidarBuffer, [0xA5, 0x5A, 0x14, 0x00, 0x00, 0x00 ], 0);
				log(`${funcName} > status case > pos=${pos}`);
				let infoStatus = {};
				infoStatus.typeCode = lidarDevice.lidarBuffer[ 6];
				infoStatus.modelNumber = lidarDevice.lidarBuffer[ 7];
				infoStatus.firmwareVersion = lidarDevice.lidarBuffer[ 9] + "." + lidarDevice.lidarBuffer[8];
				infoStatus.hardwareVersion = lidarDevice.lidarBuffer[ 10];
				infoStatus.serialNumber = "";
				for( let i=11; i < 21; i++) {
					infoStatus.serialNumber = infoStatus.serialNumber + lidarDevice.lidarBuffer[i].toString();
				}

				log(`${funcName} > infoStatus: ${JSON.stringify( infoStatus)}`);
				lidarDevice.currentCmd = null;
			}			
			lidarDevice.lidarBuffer = lidarDevice.lidarBuffer.slice( 27);
			
		// health : 10 bytes
		} else if (hasSubArray( lidarDevice.lidarBuffer, [0xA5, 0x5A, 0x03, 0x00, 0x00, 0x00 ])) {
			log(`${funcName} > recognize 'health'...`);
			if (lidarDevice.currentCmd == "health") {
				let pos = findSubArray( lidarDevice.lidarBuffer, [0xA5, 0x5A, 0x03, 0x00, 0x00, 0x00 ], 0);
				log(`${funcName} > infoHealth case > pos=${pos}`);
				
				let typeCode = lidarDevice.lidarBuffer[6];
				
				let statusCode = lidarDevice.lidarBuffer[7];
				
				let errorCode1 = lidarDevice.lidarBuffer[8];
				let errorCode2 = lidarDevice.lidarBuffer[9];
				
				let infoHealth = {};
				if (errorCode2 == 0 && errorCode1 == 0) {
					if (statusCode == 0) {
						infoHealth.value = "OK";
					} else if (statusCode == 1) {
						infoHealth.value = "running";
					} else {
						infoHealth.value = "anomaly";
					}
				} else {
					infoHealth.value = false;
				}
				log( `infoHealth: ${JSON.stringify( infoHealth)}`);
				lidarDevice.currentCmd = null;
			}			
			lidarDevice.lidarBuffer = lidarDevice.lidarBuffer.slice( 10);
			
		// ack start scan
		} else if (hasSubArray( lidarDevice.lidarBuffer, [0xA5, 0x5A, 0x05, 0x00, 0x00, 0x40, 0x81 ])) {
			log(`${funcName} > recognize 'ack scan'...`);
			if (lidarDevice.currentCmd == "startScan") {
				let pos = findSubArray( lidarDevice.lidarBuffer, [0xA5, 0x5A, 0x05, 0x00, 0x00, 0x40, 0x81 ], 0);
				log(`${funcName} > start scan case > pos=${pos}`);
				log( `startScan...`);
				
				lidarDevice.detections = {};
				lidarDevice.currentCmd = "scan";
			}
			lidarDevice.lidarBuffer = lidarDevice.lidarBuffer.slice( 7);
			
		// data
		} else if (hasSubArray( lidarDevice.lidarBuffer, [0xAA, 0x55, 0x00 ])
			|| hasSubArray( lidarDevice.lidarBuffer, [0xAA, 0x55, 0x01 ])) {
			// log(`${funcName} > recognize 'data from scan'...`);
			if (lidarDevice.currentCmd == "scan") {
				let pos = findSubArray( lidarDevice.lidarBuffer, [0xAA, 0x55 ], 0);
				// log(`${funcName} > data case > pos=${pos}`);
				// cloud or zero packet
				let type = lidarDevice.lidarBuffer[3];
				let sampleCount = lidarDevice.lidarBuffer[4];
				// log(`${funcName} > data case > sampleCount=${sampleCount}`);
				
				let nextPos = findSubArray( lidarDevice.lidarBuffer, [0xAA, 0x55 ], pos + 2);
				// log(`${funcName} > data case > nextPos=${nextPos}`);
				if (nextPos == -1) {
					// log(`${funcName} > data case > uncompled packet`);
					return;
				}			
				
				// un packet complet
				let block = lidarDevice.lidarBuffer.slice( 0, nextPos);
				if (block[ 2] == 0x00) {
					// log(`${funcName} > data case > full measures TO PROCESS...`);
					// remove strta of answer
					block = block.slice( 2);
					
					if (computeChecksum( block)) {
						// log(`${funcName} > data case > good checksum...`);
						let converted = convertBlock( block);
						// log(`${funcName} > data case > converted.length: ${converted.length}...`);
						converted.forEach( elem => {
							angle = ~~ elem.angle;
							// log(`${funcName} > data case > angle: ${angle}...add distance elem.distance: ${elem.distance}`);
							if (angle >= 0 
								&& angle < 360
								/*&& elem.distance != 0*/) {
								if ( ! lidarDevice.detections[ angle]) lidarDevice.detections[ angle] = { angle: angle, measures: [] };
								lidarDevice.detections[ angle ].measures.push( elem.distance);
							}
						});
						// log( `${funcName} > data case > lidarDevice.detections: ${JSON.stringify( lidarDevice.detections)}`);
						
						// lidarDevice.detections = [];
						Object.keys( lidarDevice.detections).forEach( angle => {
							lidarDevice.detections[ angle] = { angle: angle, measures: [ computeMean( lidarDevice.detections[ angle ].measures) ] };
						});
						
						WSServer.BroadcastToWsClients( { event: "YLIDAR-X4.detections", 
							dateTime: new Date().yyyymmddhhmmsslll() ,
							detections: lidarDevice.detections
							} );
						
						
					} else {
						log(`${funcName} > data case > BAD checksum !`);
					}
				}
				
				if (block[ 2] == 0x01) {
					// log(`${funcName} > data case > empty measures...`);
				}
				// log(`${funcName} > data case > end of processing completed block.`);
				
				// recale le buffer sur le packet suivant
				lidarDevice.lidarBuffer = lidarDevice.lidarBuffer.slice( nextPos);
				let pos2 = findSubArray( lidarDevice.lidarBuffer, [0xAA, 0x55 ], 0);
				// log(`${funcName} > data case > pos2: ${pos2}`);
			} else {
				log(`${funcName} > data case 2 > lidarDevice.currentCmd: ${lidarDevice.currentCmd}`);
				
				let pos = findSubArray( lidarDevice.lidarBuffer, [0xAA, 0x55 ], 0);
				// log(`${funcName} > data case 2 > pos: ${pos}`);
				let nextPos = findSubArray( lidarDevice.lidarBuffer, [0xAA, 0x55 ], pos + 2);
				// log(`${funcName} > data case 2 > nextPos: ${nextPos}`);
				lidarDevice.lidarBuffer = lidarDevice.lidarBuffer.slice( nextPos);
			}
		} else {
			// log(`${funcName} > other frame report !!!!!!!!!!!!!!!!!!!!!! > empty buffer`);
			lidarDevice.lidarBuffer = Buffer.from( []);
		}
		
		if (lidarDevice.lidarBuffer.length == 0) {
			bufferProcessed = true;
			// log( `${funcName} > lidarDevice.lidarBuffer empty`);
		} else {
			// log( `${funcName} > remain data in lidarDevice.lidarBuffer len: ${lidarDevice.lidarBuffer.length}`);
			if (lidarDevice.clear) {
				lidarDevice.clear = false;
				
				lidarDevice.lidarBuffer = Buffer.from( []);
				bufferProcessed = true;
				
				log( `${funcName} > lidarDevice.lidarBuffer force to empty`);
			}
		}
	}
	// log( `${funcName} > end.`);
}

/*
	*/
function lidarPortOpen() {
	if (lidarDevice.thePort != null) {
		try {
			log( `close port ${lidarDevice.sPort} ...`);
			lidarDevice.thePort.close();
			log( `port ${lidarDevice.sPort} closed`);
		} catch( err) {
			log( `error while closing port ${lidarDevice.sPort}. err: ${err}`);
		}
		lidarDevice.thePort = null;
	}
	
	lidarDevice.thePort = new SerialPort( lidarDevice.sPort, { baudRate: 128000 });
	log( `port ${lidarDevice.sPort} open`);
	lidarDevice.thePort.on('open', lidar_on_open);
	lidarDevice.thePort.on('error', lidar_on_error);
	lidarDevice.thePort.on('close', lidar_on_close);
	lidarDevice.thePort.on('data', lidar_on_data);
}

/*
	*/
function lidarPortClose() {
	if (lidarDevice.thePort != null) {
		try {
			log( `close port ${lidarDevice.sPort} ...`);
			lidarDevice.thePort.close();
			log( `port ${lidarDevice.sPort} closed`);
		} catch( err) {
			log( `error while closing port ${lidarDevice.sPort}. err: ${err}`);
		}
		lidarDevice.thePort = null;
	}
}

function lidarRequestHealth() {
	let frame = [];
	frame.push( parseInt('0xA5',16));
	frame.push( parseInt('0x91',16));
	lidarDevice.currentCmd = "health";
	log( `lidar device > request > ${lidarDevice.currentCmd}...`);	
	queueLidarCmdSend( { frame: frame } );
}

function lidarRequestInfo() {
	let frame = [];
	frame.push( parseInt('0xA5',16));
	frame.push( parseInt('0x90',16));
	lidarDevice.currentCmd = "info";
	log( `lidar device > request > ${lidarDevice.currentCmd}...`);	
	queueLidarCmdSend( { frame: frame } );
}

function lidarRequestStopScan() {
	let frame = [];
	frame.push( parseInt('0xA5',16));
	frame.push( parseInt('0x65',16));
	lidarDevice.currentCmd = "stopScan";
	log( `lidar device > request > ${lidarDevice.currentCmd}...`);		
	queueLidarCmdSend( { frame: frame } );
}

function lidarRequestStartScan() {
	let frame = [];
	frame.push( parseInt('0xA5',16));
	frame.push( parseInt('0x60',16));
	lidarDevice.currentCmd = "startScan";
	log( `lidar device > request > ${lidarDevice.currentCmd}...`);		
	queueLidarCmdSend( { frame: frame } );
}

function lidarRequestReset() {
	let frame = [];
	frame.push( parseInt('0xA5',16));
	frame.push( parseInt('0x40',16));
	lidarDevice.currentCmd = "reset";
	log( `lidar device > request > ${lidarDevice.currentCmd}...`);		
	queueLidarCmdSend( { frame: frame } );
}

function prompt() {
	rl.write( `MENU\n`);
	rl.write( `open: open port\n`);
	rl.write( `close: close port\n`);
	rl.write( `end: end all\n`);
	rl.write( `help: list commands\n`);
	rl.write( `health: get health\n`);
	rl.write( `info: get info\n`);
	rl.write( `stop: stop scan\n`);
	rl.write( `start: start scan\n`);
	rl.write( `reset: reboot\n`);
}

prompt();
rl.on('line', (cmd) => {
	switch( cmd) {
		case "open": {
			lidarPortOpen();
			break;
		}
		case "close": {
			lidarPortClose();
			break;
		}
		case "end": {
			exitHandler( undefined, -1);
			break;
		}
		case "help": {
			prompt();
			break;
		}
		case "health": {
			lidarRequestHealth();
			break;
		}
		case "info": {
			lidarRequestInfo();
			break;
		}
		case "stop": {
			lidarRequestStopScan();
			break;
		}
		case "start": {
			lidarRequestStartScan();
			break;
		}		
		case "reset": {
			lidarRequestReset();
			break;
		}
		case "clear": {
			lidarDevice.clear = true;
			break;
		}
		default: break;
	}
});

/*
	*/
WSServer.Initialize( 9081, WSServerMessageHandler, WSServerOnDisconnect, function( err) {
	const funcName = "WSServer.Initialize";
	if (err) {
		log( `${funcName} > err: ${err}`);
	} else {
		log( `${funcName} > OK`);
		WSServer.BroadcastToWsClients( { event: "system.connect", dateTime: new Date().yyyymmddhhmmsslll() } );
	}
});

/*
	*/
function WSServerOnDisconnect( context) {
	const funcName = "WSServerOnDisconnect";
	
	try {
		log( `${funcName} > context.origin: ${context.origin}`);
	} catch(err) {
		console.trace( `${funcName} > ${err}`);
	}
}
	
function WSServerMessageHandler( context, message) {
	const funcName = "WSServerMessageHandler";
	
	if (message.type === 'utf8') {
		log( `${funcName} > receive: ${message.utf8Data}`);
		
		try {
			let jsn = JSON.parse( message.utf8Data);
			
			switch( jsn.destin) {
				case "YDLIDAR_X4": {
					
					switch( jsn.cmd) {
						case "port.open": {
							lidarPortOpen();
							break;
						}

						case "port.close": {
							lidarPortClose();
							break;
						}

						case "health": {
							lidarRequestHealth();
							break;
						}

						case "info": {
							lidarRequestInfo();
							break;
						}
						
						case "scan.start": {
							lidarRequestStartScan();
							break;
						}

						case "scan.stop": {
							lidarRequestStopScan();
							break;
						}

						default: {
							break;
						}
					}
					break;
				}
				
				case "System": {
					switch( jsn.cmd) {
						case "end": {
							exitHandler( undefined, -1);
							break;
						}
						default: {
							break;
						}
					}
				}
			
				default: {
					break;
				}
			}
		} catch( err) {
			log( `$funcName} > err: ${err}`);
		}
	}
}

/*
	*/
HttpServer.Initialize( httpRequestHandler, function( err) {
	const funcName = "HttpServer.Initialize";
	if (err) {
		log( `${funcName} > err: ${err}`);
	} else {
		log( `${funcName} > OK`);
	}
});

/* Process Http request
	*/
function httpRequestHandler( request, response) {
	const funcName = "httpRequestHandler";
	
	let logDebug = true;
	if (logDebug) 
		log( `${funcName} > request.url > ${request.url}` );

	let parseUrl = url.parse( decodeURI( request.url), true);
	let query = parseUrl.query;		
	let filePath = /* './pages' + */ "." + parseUrl.pathname;
	if (logDebug) 
		log( `${funcName} > filePath > ${filePath}` );
	
	let extname = "";
	if (parseUrl.path != ""
		&& parseUrl.path != "/"
		&& fs.existsSync( filePath)) {
						
		extname = path.extname( filePath);
		let contentType = 'text/html';
		switch (extname) {
				case '.js':
						contentType = 'text/javascript';
						break;
				case '.css':
						contentType = 'text/css';
						break;
				case '.json':
						contentType = 'application/json';
						break;
				case '.png':
						contentType = 'image/png';
						break;      
				case '.jpg':
						contentType = 'image/jpg';
						break;
				case '.wav':
						contentType = 'audio/wav';
						break;
		}
		
		if (logDebug) 
			log( `${funcName} > file found > ${filePath} with contentType=${contentType}`);

		fs.readFile( filePath, function( error, content) {
			if (error) {
				if (error.code == 'ENOENT'){
					
					fs.readFile('./pages/404.html', function(error, content) {
						if (error) {
							response.writeHead(404);
							response.end('Erreur : 404 (page introuvable)\n', 'utf-8');
							response.end(); 
						}
						else {
							response.writeHead(200, { 'Content-Type': contentType });
							response.end(content, 'utf-8');
						}
					});
				}
				else {
					response.writeHead(500);
					response.end('Erreur : ' + error.code+' ..\n', 'utf-8');
					response.end(); 
				}
			}
			else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end( content, 'utf-8');
			}
		});	
	} else if (parseUrl.pathname == '/WebAppParameters/set') {
			
		let fileName = query['fileName'];
		
		var body = ''
		request.on( 'data', function(data) {
			body += data
			//Starter.log( funcName, 'Partial body: ' + body)
		});
		
		request.on('end', function() {
			try {
				const data = fs.writeFileSync( fileName, body);
				var jAnswer = { 'request': parseUrl.path, 'report' : 'OK', 'comment' : '', 'newValue': 'data saved in ' + fileName};
				var sAnswer = JSON.stringify(jAnswer);
				response.writeHead( 200, { 'Content-Type': 'text/html' });
				response.end( sAnswer);
				} 
			catch (err) {
				Starter.log( funcName, parseUrl.path + ' > fails > ' + err);
				response.writeHead(404);
				response.end( `/WebAppParameters/set > Erreur : ${err}\n`, 'utf-8');
				
				log( `${funcName} > /WebAppParameters/set > Erreur : ${err}`);
				}
		});
			
	} else {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.write('YLIDAR_X4 > bad url !');
		response.end();
	}
}
