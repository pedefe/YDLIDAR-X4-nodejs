/* util.js
	2020-06-16, FPI
		xmlToJson, getNodePath
	2020-04-09, FPI
		isJson
	2020-03-22, FPI
		> decimale
	2020-03-05, FPI
		> lines, lineCount
	2020-02-14, FPI
		bug dans minuteOfTheYear
	2019-10-09, FPI
		> getRandomInt
	
	2019-03-21, FPI
	- javascript
	- utilisé par accueil.html du NexoManager
	*/
/*
	==> completer à gauche un nombre
		number.toString().padStart( sur_combien_de_digits, char)
	
	sur une collection
	$.each( rCols, function( key, value ) {		
	
	arr.forEach( e => {
		
		});
		
	// supprimer une clé
	delete jsn[ key]
	
	// chaine dans une autre
	String.includes( word)
	
	// sous chaine
	String.substring( indexDebut, indexFin)
		index commençant à 0
	
*/

/*Object.prototype.jcopy = function() {
	return JSON.parse( JSON.stringify( this));
	}*/

/*
	*/
function angleDiff( angleFinal, angleInitial) {
	let a = angleFinal - angleInitial;
	if (a > 180) a -= 360;
	else if (a < -180) a += 360; 
	return a;
	}
	
/*
	*/
function hasClass(element, className) {
  return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
	}
	
/*
	*/
function isJson( obj) {
	let report = false;
	try {
		let j = JSON.stringify( obj);
		report = true;
		}
	catch(err){}
	return report;
	}
	
/*
	*/
function decimale( obj, nb) {
	return Number.parseFloat( Number.parseFloat( obj).toFixed( nb));
	}
	
/* convert text in lines 
	*/
String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length; }

/* MouseEvent
	*/
function whichMouseButton(event) {
	var btn = "none";
	if (!event) var event = window.event;
	if (event.which) {
		if (event.which == 3) {
			btn = "right";
			}
		else if (event.which == 2) {
			btn = "middle";
			}
		else if (event.which == 1) {
			btn = "left";
			}
		}
	else if (event.button) {
		if (event.button == 2) {
			btn = "right";
			}
		else if (event.button == 1) {
			btn = "left";
			}
		}
	else if (event.originalEvent) {
		if (event.originalEvent.button == 2) {
			btn = "right";
			}
		else if (event.originalEvent.button == 0) {
			btn = "left";
			}
		}
	return btn;
	}
	
/*	switch to fullscreen
	*/
var _isFullScreen = false;
function isFullScreen() {
	return _isFullScreeen;
	}

function openFullscreen() {
	let elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
		_isFullScreen = true;
		} 
	else if (elem.mozRequestFullScreen) { /* Firefox */
		elem.mozRequestFullScreen();
		_isFullScreen = true;
		} 
	else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen();
		_isFullScreen = true;
		} 
	else if (elem.msRequestFullscreen) { /* IE/Edge */
		elem.msRequestFullscreen();
		_isFullScreen = true;
		}
	}
	
/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
		_isFullScreen = false;
		} 
	else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
		_isFullScreen = false;
		} 
	else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
		_isFullScreen = false;
		} 
	else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
		_isFullScreen = false;
		}
	}

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
	};

function ValidateIPaddress(ipaddress) {
	 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
		{
			return true;
		}
	
	return false;
	}
	
/*
	*/
function getFromPath( json, path) {
	var report = json;
	var arr = path.splitEx( "/");
	for( var i=0; i < arr.length; i++) {
		if ( arr[i] in report) {
			report = report[ arr[i]];
			}
		else {
			report = null;
			break;
			}
		}
	return report;
	}
   
/* formatage de chaine avec des arguments */
if (!String.prototype.format) {
	String.prototype.format = function() {
	  var args = arguments;
	  return this.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined'
		  ? args[number]
		  : match;
		});
	  };
	}

/*
'2015-09-30 16:20:30.0.12752200'
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
/*
'2015-09-30 16:20:30.1'
*/
Date.prototype.yyyymmddhhmmssl = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	var l = this.getMilliseconds() < 100 ? "0" : Math.floor( this.getMilliseconds() / 100);
	return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss + '.' + l;
	};

Date.prototype.yyyymmddhhmmss = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
	};

Date.prototype.hhmmss = function() {
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	return hh + ':' + min + ':' + ss;
	};

Date.prototype.asUTC = function() {
	
	var now_utc =  new Date(
		this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(),
		this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());
	now_utc.setUTCMilliseconds( this.getUTCMilliseconds());
	
	return now_utc;
	};

/**/
Date.prototype.addSeconds = function ( seconds) {
	return new Date( this.getTime() + seconds * 1000);
}

/**/
Date.prototype.addMinutes = function ( minutes) {
	return new Date( this.getTime() + minutes * 60 * 1000);
	}

/**/
Date.prototype.addHours = function ( hours) {
	return new Date( this.getTime() + hours * 3600 * 1000);
	}

/**/
Date.prototype.addDays = function ( days) {
	return new Date( this.getTime() + days * 24 * 3600 * 1000);
	}

/**/
Date.prototype.addMonths = function ( months) {
	let d = new Date( this.valueOf());
	return new Date( d.setMonth( d.getMonth() + months));
	}

/**/
var _weekDay = new Array(7);
_weekDay[0]="dim.";
_weekDay[1]="lun.";
_weekDay[2]="mar.";
_weekDay[3]="mer.";
_weekDay[4]="jeu.";
_weekDay[5]="ven.";
_weekDay[6]="sam.";

var _monthString = new Array(12);
_monthString[0]="Janv.";
_monthString[1]="Fevr.";
_monthString[2]="Mars ";
_monthString[3]="Avril";
_monthString[4]="Mai  ";
_monthString[5]="Juin ";
_monthString[6]="Juil.";
_monthString[7]="Août ";
_monthString[8]="Sept.";
_monthString[9]="Octo.";
_monthString[10]="Nov. ";
_monthString[11]="Dec. ";

Date.prototype.getDayOfWeekString = function() {
	return _weekDay[ this.getDay()];
	}

Date.prototype.getMonthString = function() {
	return _monthString[ this.getMonth()];
	}
/**
 */
function strToDate( str) {
	let date = new Date();
	try {
		date = new Date( Date.parse( str));
		}
	catch(err) {
		let x = err;
		}
	return date;
	}
	
/**
 */
function strDateToStrLocal( str) {
	let date = strToDate( str);
	return date.yyyymmddhhmmsslll();
	}

/** date lisible : mer 12 Juin ...
 */
function strDateLiteral( str) {

	let date = strToDate( str);

	let yyyy = date.getFullYear();
	let mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
	let dd  = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	let min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	let lll = date.getMilliseconds() < 10 ? "00" + date.getMilliseconds() : 
		date.getMilliseconds() < 100 ? "0" + date.getMilliseconds() :
		date.getMilliseconds();
	let dayOfWeekString = date.getDayOfWeekString();
	let monthString = date.getMonthString();
	return  "{0} {1} {2} {3} {4}:{5}:{6}".format( dayOfWeekString, dd, monthString, yyyy, hh, min, ss);
	}

function timedatectlFormat() {
	
	var date = new Date(); 
	// var hutc = date.getUTCHours();
	var now_utc =  new Date(
		date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
		date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	
	return now_utc.yyyymmddhhmmss();
	};

/* convert ITS time (since 2004) to true date
	*/
function ITSTimeToDate( ITSTime) {

	let dt = new Date( ITSTime);
	dt.setFullYear( dt.getFullYear() + 34);
	dt = dt.addDays( -1);
	return dt;
	}

function TimeStampMilliToDate( unix_timestamp ) {
	// Create a new JavaScript Date object based on the timestamp
	
	return new Date(unix_timestamp);
	}

function TimeStampMilliToStrDate( unix_timestamp ) {
	// Create a new JavaScript Date object based on the timestamp
	
	var date = new Date(unix_timestamp);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();

	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = date.getMinutes();
	// Seconds part from the timestamp
	var seconds = date.getSeconds();
	var millis = date.getMilliseconds();

	// Will display time in 10:30:23 format
	var formattedTime = 
		year.toString().padStart(4, '0') 
		+ '/' + month.toString().padStart(2, '0') 
		+ '/' + day.toString().padStart(2, '0') 
		+ '-' + hours.toString().padStart(2, '0') 
		+ ':' + minutes.toString().padStart(2, '0')  
		+ ':' + seconds.toString().padStart(2, '0')
		+ '.' + millis.toString().padStart(3, '0') ;
	return formattedTime;
	}

/*
	*/
function minutesOfTheYear( now) {
	var m_o_y = 0;
	if (now == undefined) {
		now = new Date();
		}
	var start = new Date(now.getFullYear(), 0, 1);
	var end = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
	
	var diff = end - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor( diff / oneDay);
	
	// console.debug( "end=" + end.toString() + ", day=" + day);
	
	m_o_y = day * 1440;	
	m_o_y = m_o_y + now.getHours() * 60 + now.getMinutes();
	
	return m_o_y;
	}

/*
	*/
function saveData( blob, fileName) {
	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";

	var url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = fileName;
	a.click();
	window.URL.revokeObjectURL(url);
}
/*
	*/
function saveTextAsFile( strText, strFileName, dotAndExt) {

	// grab the content of the form field and place it into a variable
	var textToWrite = strText;
		
	//  create a new Blob (html5 magic) that conatins the data from your form feild
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	
	// Specify the name of the file to be saved
	if (strFileName == null) {
		strFileName = "export-" + new Date().yyyymmddhhmmss() + dotAndExt;
		}
	var fileNameToSaveAs = strFileName;

	// Optionally allow the user to choose a file name by providing 
	// an imput field in the HTML and using the collected data here
	// var fileNameToSaveAs = txtFileName.text;

	// create a link for our script to 'click'
	var downloadLink = document.createElement("a");
	//  supply the name of the file (from the var above).
	// you could create the name here but using a var
	// allows more flexability later.
	downloadLink.download = fileNameToSaveAs;
	// provide text for the link. This will be hidden so you
	// can actually use anything you want.
	downloadLink.innerHTML = "My Hidden Link";

	// allow our code to work in webkit & Gecko based browsers
	// without the need for a if / else block.
	window.URL = window.URL || window.webkitURL;
				
	// Create the link Object.
	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	// when link is clicked call a function to remove it from
	// the DOM in case user wants to save a second file.
	downloadLink.onclick = destroyClickedElement;
	// make sure the link is hidden.
	downloadLink.style.display = "none";
	// add the link to the DOM
	document.body.appendChild(downloadLink);

	// click the new link
	downloadLink.click();
	}
	
function destroyClickedElement(event) {
	// remove the link from the DOM
	document.body.removeChild(event.target);
	}

/**/
function deleteAllChild(nodeId) {
	var myNode = document.getElementById(nodeId);
	if (myNode == null) return;
	while (myNode.firstChild) {
    	myNode.removeChild( myNode.firstChild);
		}
	}

/*
function walkJson2( jsonObj, path, callBack) {
	
	if (path == undefined) path = "";
	
	if( typeof jsonObj == "object" ) {
		
		$.each( jsonObj, function( key, value) {
			
			let locPath = path + "/" + key;
			
			if (key != "parent") {
				if (callBack( this, key, value, locPath)) {
					return true;
					}
					
				if ( typeof value == "object") {
					if (walkJson( value, locPath, callBack)) {
						return true;
						}
					}
				}
			});
		}
	else {
		// jsonOb is a number or string
		}
	return false;
	}*/
	
function walkJson( jsonObj, path, callBack) {

	if (path == undefined) path = "";
	
	// var result = {};
	
	for (let x in jsonObj) {
				
		let locPath = path + "/" + x;
		let shouldEnd1 = callBack( this, x, jsonObj[x], locPath);
		if (shouldEnd1) return true;
			
		if (Array.isArray( jsonObj[x])) {
			for( let a of jsonObj[x]) {
				let locPath2 = locPath + "/" + a;
				shouldEnd = walkJson( a, locPath2, callBack);
				if (shouldEnd) return true;
				}
			}
		else if (isObject( jsonObj[x])) {
			shouldEnd = walkJson( jsonObj[x], locPath, callBack);
			if (shouldEnd) return true;
			}
		else {
			/*let shouldEnd = callBack( this, x, jsonObj[x], locPath);
			if (shouldEnd) return true;*/
			}
		}
	return false;
	}
	
String.prototype.insertString = function( start, newSubStr) {
	return this.slice( 0, start) + newSubStr + this.slice(start);
	};

/**/
function removeValueFromArray( arr, val) {
	var index = arr.indexOf(val);
	if (index > -1) {
		arr.splice( index, 1);
		}
	return arr;
	}	
	
/**/
function removeFieldValueFromArray( arr, field, val) {
	for( var index = 0; index < arr.length; index++) {
		if (arr[index][field] == val){
			arr.splice( index, 1);
			break;
			}
		}
	return arr;
	}	
	
/* return int between min (included) and max (included)
	*/
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor( Math.random() * (max - min + 1) ) + min;
	}

/*
	*/
function rndCol() {
	return fullColorHex( getRandomInt( 0, 255), getRandomInt( 0, 255), getRandomInt( 0, 255));
	}

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
	}
 
// then to call it, plus stitch in '4' in the third group
function newGuid() {
	return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	}

/**/
function isFieldInArray( arr, field, val) {
	var report = -1;
	for( var index = 0; index < arr.length; index++) {
		if (arr[index][field] == val){
			report = index;
			break;
			}
		}
	return report;
	}	
		
/**/
function isInArray( arr, val) {
	if (arr == undefined || arr.length == 0) {
		return false;
		}	
	else {
		if (arr.indexOf( val) > -1) {
			return true;
			}
		else {
			return false;
			}
		}	
	}	

/**/
function ArrayMoveUp( arr, value) {
	var pos = undefined;
	for( var i1=0; i1 < arr.length; i1++) {
		if (arr[i1] == value) {
			pos = i1;
			break;
			}
		}
	if (pos != undefined && pos != 0) {
		var t = arr[pos-1];
		arr[pos-1] = arr[pos];
		arr[pos] = t;
		}
	return arr;
	}
	
/**/
function ArrayMoveDown( arr, value) {
	var pos = undefined;
	for( var i1=0; i1 < arr.length; i1++) {
		if (arr[i1] == value) {
			pos = i1;
			break;
			}
		}
	if (pos != undefined && pos != arr.length-1) {
		var t = arr[pos+1];
		arr[pos+1] = arr[pos];
		arr[pos] = t;
		}
	return arr;
	}
/**/
function getFileExtension( fileName) {
	return fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
	}

/**/
function getFileName( fileName) {
	return fileName.replace(/.[^.]+$/,'');
	}

/**/
function isValidFileName(fname){
	var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
	var rg2=/^\./; // cannot start with dot (.)
	var rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
	return rg1.test(fname)&&!rg2.test(fname)&&!rg3.test(fname);
	}
	
/*
	*/
String.prototype.isEmpty = function() {
	if (this == undefined || this == "") {
		return true;
		}
	else {
		return false;
		}
	}	

/*
	*/
String.prototype.splitEx = function(sep) {
	var result = []
	parts = this.split(sep)
	for( var i1=0; i1 < parts.length; i1++) {
		if (parts[i1].isEmpty() == false) {
			result.push( parts[i1]);
			}
		}
	return result;
	}

/*
	*/
function replaceAccents(str){
  // verifies if the String has accents and replace them
  if (str.search(/[\xC0-\xFF]/g) > -1) {
      str = str
			.replace(/[\xC0-\xC5]/g, "A")
			.replace(/[\xC6]/g, "AE")
			.replace(/[\xC7]/g, "C")
			.replace(/[\xC8-\xCB]/g, "E")
			.replace(/[\xCC-\xCF]/g, "I")
			.replace(/[\xD0]/g, "D")
			.replace(/[\xD1]/g, "N")
			.replace(/[\xD2-\xD6\xD8]/g, "O")
			.replace(/[\xD9-\xDC]/g, "U")
			.replace(/[\xDD]/g, "Y")
			.replace(/[\xDE]/g, "P")
			.replace(/[\xE0-\xE5]/g, "a")
			.replace(/[\xE6]/g, "ae")
			.replace(/[\xE7]/g, "c")
			.replace(/[\xE8-\xEB]/g, "e")
			.replace(/[\xEC-\xEF]/g, "i")
			.replace(/[\xF1]/g, "n")
			.replace(/[\xF2-\xF6\xF8]/g, "o")
			.replace(/[\xF9-\xFC]/g, "u")
			.replace(/[\xFE]/g, "p")
			.replace(/[\xFD\xFF]/g, "y");
		}

  return str;
	}

String.prototype.toUpperPdf = function() {
	
	var correctedString = replaceAccents(this).toUpperCase();
	return  correctedString;
	}

function isFilled( o)  {
	if (o == undefined || o.toString() == "") {
		return false;
		}
	else {
		return true;
		}
	}

/*
	*/
Array.prototype.move = function( from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
	};

/*
	*/
String.prototype.uIndexOf = function( subString) {
	ignoreCase = true
	useLocale = true
	string1 = this
	string2 = subString
	if (ignoreCase) {
		if (useLocale) {
			string1 = string1.toLocaleLowerCase();
			string2 = string2.toLocaleLowerCase();
			}
		else {
			string1 = string1.toLowerCase();
			string2 = string2.toLowerCase();
			}
		}
	return string1.indexOf( string2);
	}
	
/**/	
function setCookie( cookieName, cookieValue, expirationMilliSeconds) {
	var d = new Date();
	d.setTime( d.getTime() + expirationMilliSeconds);
	var expires = "expires="+d.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + "; " + expires;
	}
	
/**/
function getCookieValue( cookieName) {
	var name = cookieName + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
			}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
			}
		}
	return null;
	}

/*
	*/
function isClass( element, name) {
	var success = false;
	var arr = element.className.split(" ");
	if (arr.indexOf(name) != -1) success = true;
	return success;  
	}
/*
<audio id="audio" src="./medias/beep-07.wav" autoplay="false" ></audio>
*/
function PlaySound( soundId) {
	try {
		var sound = document.getElementById(soundId);
		if (sound != null) {
			sound.play();
			}
		}
	catch(err) {
		var x = err;
		}
	}

function interpolateColor( color1, color2, factor) {
    if (arguments.length < 3) { 
        factor = 0.5; 
			}
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
			}
    return fullColorHex( result[0], result[1], result[2]);
	}

/*
	*/
var fullColorHex = function( r, g, b) {   
	var red = valToHex(r);
	var green = valToHex(g);
	var blue = valToHex(b);
	return "#" + red + green + blue;
	};

/*
	*/
function valToHex( x) {
	x = x.toString(16);
	return (x.length == 1) ? '0' + x : x;
	}

/*
	*/
function isPointInPoly( point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	var inside = false;

	var x = point[0], y = point[1];

	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
		}

	return inside;
	}

/* ratio, decimal between 0 and 1
	*/
function colorGradient( color1, color2, ratio) {

	var r = Math.ceil( parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	var g = Math.ceil( parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	var b = Math.ceil( parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

	/*var r = Math.ceil( color1.r * ratio + color2.r * (1-ratio) );
	var g = Math.ceil( color1.g * ratio + color2.g * (1-ratio) );
	var b = Math.ceil( color1.b * ratio + color2.b * (1-ratio) );*/
	
	return valToHex(r) + valToHex(g) + valToHex(b);

	//return rgb(r, g, b);
	}
/*
	*/
var _mouseX = 0;
var _mouseY = 0;
function preparePage() {

	/**/
	$(document).mousemove(function(e) {
		_mouseX = e.pageX;
		_mouseY = e.pageY;
		}).mouseover(); // call the handler immediately
	
	// prevent from d&d
	document.body.addEventListener("dragover", function(e) {
		e.preventDefault();
		}, 
		false);
	
	document.body.addEventListener("drop", function(e) {
		e.preventDefault();
		}, 
		false);

	// disable the default browser's context menu.
	$(document).bind("contextmenu", function (e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
		});

	}

var _previousOnTop = null;
var _previousOnTopIndex = null;
function setOnTop( element) {
	if (_previousOnTop != null && _previousOnTopIndex != null) {
		_previousOnTop.style.zIndex = _previousOnTopIndex;
		}
	
	_previousOnTopIndex = element.position;
	_previousOnTop = element;
	element.style.zIndex = 9999;
	}

function isObject (value) {
	var type = typeof value;
	return type === 'function' || type === 'object' && !!value;
	/*return value 
		&& typeof value === 'object' 
		&& value.constructor === Object;*/
	}

function iterationCopy(src) {
	return Object.assign({}, src);
	/*
	let target = {};
	for (let prop in src) {
		if (src.hasOwnProperty(prop)) {
			// if the value is a nested object, recursively copy all it's properties
			if (isObject(src[prop])) {
				target[prop] = iterationCopy(src[prop]);
			} else {
				target[prop] = src[prop];
			}
			}
		}
	return target;*/
	}
	
/* Valorise une chaine json pour l'affichage
	*/
function syntaxHighlight( json) {
	let str = JSON.stringify( json, undefined, 4);
	str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		var cls = 'number';
		if (/^"/.test(match)) {
			if (/:$/.test(match)) {
				cls = 'key';
				} 
			else {
				cls = 'string';
				}
			}
		else if (/true|false/.test(match)) {
			cls = 'boolean';
			} 
		else if (/null/.test(match)) {
			cls = 'null';
			}
		return '<span class="' + cls + '">' + match + '</span>';
		});
	}

/*
	*/
function setComboDefault( comboId, valueIdx) {

	let ctrlDataListSel = $("#" + comboId);
	let nbOptions = ctrlDataListSel[0].options.length;
	if (nbOptions == 0) return;
	let oldValue = ctrlDataListSel[0].value;

	if (valueIdx+1 > nbOptions) return;
	ctrlDataListSel[0].value = ctrlDataListSel[0].options[valueIdx].value;
	ctrlDataListSel[0].text = ctrlDataListSel[0].options[valueIdx].text;
	ctrlDataListSel.trigger('change');
	}

/*
	*/
function setComboDefaultByValue( comboId, value) {

	let ctrlDataListSel = $("#" + comboId);
	let nbOptions = ctrlDataListSel[0].options.length;
	if (nbOptions == 0) return;

	let valueIdx = 0;
	for( let o = 0; o < nbOptions; o++ ) {
		if (ctrlDataListSel[0].options[o].value == value ) {
			valueIdx = o;
			break;
			}
		}

	ctrlDataListSel[0].value = ctrlDataListSel[0].options[valueIdx].value;
	ctrlDataListSel[0].text = ctrlDataListSel[0].options[valueIdx].text;
	ctrlDataListSel.trigger('change');
	}

/* #select, #combo
	*/
function addComboItem( comboId, value, text) {
	
	let ctrlDataList = $("#" + comboId)[0];
	let opt = document.createElement('option');
	opt.appendChild( document.createTextNode( text) );
	opt.value = value; 
	ctrlDataList.appendChild( opt); 	
	}
	
/* #select, #combo
	*/
function isComboValue( comboId, value) {
	let exist = false;
	let ctrlDataListSel = $("#" + comboId);
	let nbOptions = ctrlDataListSel[0].options.length;
	if (nbOptions == 0) return exist;

	for( let o = 0; o < nbOptions; o++ ) {
		if (ctrlDataListSel[0].options[o].value == value ) {
			exist = true;
			break;
			}
		}
	return exist;
	}
	
/* #select, #combo
	*/
function getComboTextByValue( comboId, value) {
	let text = "?";
	let ctrlDataListSel = $("#" + comboId);
	let nbOptions = ctrlDataListSel[0].options.length;
	if (nbOptions == 0) return text;

	for( let o = 0; o < nbOptions; o++ ) {
		if (ctrlDataListSel[0].options[o].value == value ) {
			text = ctrlDataListSel[0].options[o].text;
			break;
			}
		}
	return text;
	}

/*
	*/
function V2XToLat(iLat) {
	let sVal = iLat.toString();
	sVal = sVal.insertString( sVal.length - 7, ".");
	let dValue = parseFloat( sVal);
	return dValue;
	}

function V2XToLon(iLon) {
	let sVal = iLon.toString();
	sVal = sVal.insertString( sVal.length - 7, ".");
	let dValue = parseFloat( sVal);
	return dValue;
	}

function V2XToAlt(iLat) {
	let sVal = iLat.toString();
	let dValue = parseFloat( sVal);
	dValue = dValue / 100;
	return dValue;
	}
		
/*
	*/
function latToV2X( dLat) {
	let value = dLat.toFixed(7);
	let svalue = value.toString().replaceAll(".","");
	return svalue;
	}

/*
	*/
function lonToV2X( dLon) {
	let value = dLon.toFixed(7);
	let svalue = value.toString().replaceAll(".","");
	return svalue;
	}	

/*
	*/
function numberWithThousand( x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

/*
	*/
function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);

	var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " m, " : " m, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
	return hDisplay + mDisplay + sDisplay; 
	}

function isVisible(el) {
	let style = window.getComputedStyle(el);
	return (style.visibility === 'visible');
	}

function isDisplayed(el) {
	let style = window.getComputedStyle(el);
	return (style.display  === "none");
	}

function getElemDimension( elem) {
	return { w: window.getComputedStyle( elem).width.replaceAll('px', ''), h: window.getComputedStyle( elem).height.replaceAll('px', '') };
	}

function jsonHasKeys( o) {
	if (Object.keys(o).length > 0) return true;
	else return false;
	}
// standard keycode
var keyCode_enter = 13;
var keyCode_upArrow	= 38;
var keyCode_downArrow = 40;
var keyCode_pgUp = 33;
var keyCode_pgDown = 34;
var keyCode_Home = 36;
var keyCode_End = 35;
var keyCode_Space = 32;

var keyCode_leftArrow	= 37;
var keyCode_rightArrow = 39;

var keyCode_A = 65;
var keyCode_G = 71;

var keyCode_a = 97;
var keyCode_g = 103;

var keyCode_s = 115;

var keyCode_m = 109;

var keyCode_M = 77;

var keyCode_sharp = 51;
var keyCode_exclam = 223;

var keyCode_0 = 48;
var keyCode_9 = 57;


/*	in :
		iDay : 0..6
	*/
Date.prototype.setDay = function (iDay) {
	let currentDay = this.getDay();
	let distance = iDay - currentDay;
	this.setDate( this.getDate() + distance);
	}

Date.prototype.addDays = function(days) {
	let date = new Date (this.valueOf());
	date.setDate( date.getDate() + days);
	return date;
	}

/*	dernier jour du mois
	*/
function getDaysInMonth( month, year) {
	return new Date( year, month+1, 0).getDate();
	}


function addDateIntervalOption( elementSelector, elementDateMin, elementDateMax ) {
	let content = "\
		<option value='last_10m'>dernières 10 minutes</option>\
		<option value='last_60m'>dernière heure</option>\
		<option value='currHour'>heure courante</option>\
		<option value='last_6h'>dernière 6h</option>\
		<option value='currDay'>aujourd'hui</option>\
		<option value='last_24h'>dernière 24h</option>\
		<option value='currWeek'>semaine en cours</option>\
		<option value='last_7d'>derniers 7 jours</option>\
		<option value='currMonth'>mois en cours</option>\
		<option value='last_31d'>derniers 30 jours</option>\
		<option value='last_6M'>derniers 6 mois</option>\
		<option value='currYear'>année en cours</option>\
		<option value='last_365'>dernière année</option>\
		";
	elementSelector[0].insertAdjacentHTML( 'beforeend', content);

	/*
		*/
	elementSelector.mouseup(function() {
		var open = $(this).data("farIsOpen");
		// console.log("open: " + open);
		if (open == 1) {
			changeSelector($(this) );
			}
		$(this).data("farIsOpen", !open);
		});

	function changeSelector( elementSelector) {
		let periode = elementSelector[0].value;
		let params = { target: periode }
		if (setDateInterval( params)) {
			elementDateMin.value = params.first.yyyymmddhhmmss();
			elementDateMax.value = params.last.yyyymmddhhmmss();
			}
		}

	/*
		*/
	elementSelector.on( "change", function(){
		changeSelector( elementSelector);
		});
	}

/* dernier jour du mois en cours
	*/
Date.prototype.getDaysInMonth = function( month, year) {
	return new Date( this.getFullYear(), this.getMonth() + 1, 0).getDate();
	}

/*
	in:
		jsn.target => 
			'last_10m'
			'last_60m'
			'currHour'
			'last_6h'
			'currDay'
			'last_24h'
			'currWeek'
			'last_7d'
			'currMonth'
			'last_31d'
			'last_6M'
			'currYear'
			'last_365'
	out :
		jsn.first => date
		jsn.last => date

	return:
		true, false


	setMilliseconds
	setSeconds
	setMinutes
	setHours
	
	*/
function setDateInterval( jsn) {

	let completed = true;

	try {
		switch( jsn.target) {

			case 'last_10m': {
				let last = new Date();
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date();
				first = first.addMinutes( -10);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'last_60m': {

				let last = new Date();
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;
				
				let first = new Date();
				first = first.addMinutes( -60);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'currHour': {

				let last = new Date();
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date();
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'last_6h': {

				let last = new Date();
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date();
				first = first.addHours( -6);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'currDay': {

				let last = new Date();
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date();
				first.setHours( 0);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'last_24h': {

				let last = new Date();
				/*last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);*/
				jsn.last = last;

				let first = new Date( last.valueOf());
				first = first.addHours( -24);
				/*first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);*/
				jsn.first = first;
				break;
				}

			case 'currWeek': {

				let last = new Date();
				last.setDay( 0);
				last = last.addDays( 7);
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date( last.valueOf());
				first = first.addDays( -6);
				first.setHours( 0);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'last_7d': {

				let last = new Date();
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date();
				first = first.addDays( -6);
				first.setHours( 0);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}		

			case 'currMonth': {	

				let last = new Date();
				last.setDate( last.getDaysInMonth());
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date( last.valueOf());
				first.setDate( 1);
				first.setHours( 0);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'last_31d': {

				let last = new Date();
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date();
				first = first.addMonths( -1);
				first = first.addDays( 1);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'last_6M': {

				let last = new Date();
				last.setDate( last.getDaysInMonth());
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date( last.valueOf());
				first = first.addMonths( -6);
				first.setDate( 0);
				first.setHours( 0);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'currYear': {

				let last = new Date();
				last.setMonth( 11);
				last.setDate( last.getDaysInMonth());
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date( last.valueOf());
				first = first.addMonths( -12);
				first = first.addDays( 1);
				first.setHours( 0);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}

			case 'last_365': {

				let last = new Date();
				last.setHours( 23);
				last.setMinutes( 59);
				last.setSeconds( 59);
				last.setMilliseconds( 999);
				jsn.last = last;

				let first = new Date( last.valueOf());
				first = first.addMonths( -12);
				first = first.addDays( 1);
				first.setHours( 0);
				first.setMinutes( 0);
				first.setSeconds( 0);
				first.setMilliseconds( 0);
				jsn.first = first;
				break;
				}
	
			default: {
				completed = false;
				jsn.last = new Date();
				jsn.first = new Date();
				break;
				}
			}
		}
	catch(err) {
		completed = false;
		console.debug( "setDateInterval > " + JSON.stringify( jsn) + " > err=" + err);
		}
	return completed;
	}

/*
	*/
function getDateStartOfDay( d) {

	let first = new Date( d.valueOf());
	first.setHours( 0);
	first.setMinutes( 0);
	first.setSeconds( 0);
	first.setMilliseconds( 0);
	return first;
	}

/*
	*/
function getDateStartOfWeek( d) {

	let last = new Date( d.valueOf());
	last.setDay( 0);
	last = last.addDays( 7);
	last.setHours( 23);
	last.setMinutes( 59);
	last.setSeconds( 59);
	last.setMilliseconds( 999);

	let first = new Date( last.valueOf());
	first = first.addDays( -6);
	first.setHours( 0);
	first.setMinutes( 0);
	first.setSeconds( 0);
	first.setMilliseconds( 0);
	return first;
	}

/*
	*/
function getDateStartOfMonth( d) {

	let last = new Date( d.valueOf());
	last.setDate( last.getDaysInMonth());
	last.setHours( 23);
	last.setMinutes( 59);
	last.setSeconds( 59);
	last.setMilliseconds( 999);

	let first = new Date( last.valueOf());
	first.setDate( 1);
	first.setHours( 0);
	first.setMinutes( 0);
	first.setSeconds( 0);
	first.setMilliseconds( 0);
	
	return first;
	}

/*
	*/
function getDateStartOfYear( d) {

	let last = new Date( d.valueOf());
	last.setMonth( 11);
	last.setDate( last.getDaysInMonth());
	last.setHours( 23);
	last.setMinutes( 59);
	last.setSeconds( 59);
	last.setMilliseconds( 999);

	let first = new Date( last.valueOf());
	first = first.addMonths( -12);
	first = first.addDays( 1);
	first.setHours( 0);
	first.setMinutes( 0);
	first.setSeconds( 0);
	first.setMilliseconds( 0);

	return first;
	}

/*
	*/
function changeListSelection( selection, target ) {
	
	let newSel = selection;

	if (selection != null) {
		selection.classList.remove( 'myListSelected');
		newSel = null;
		}

	if (isClass( target, 'myListSelected')) {
		target.classList.remove('myListSelected');
		}
	else {
		target.classList.add('myListSelected');
		newSel = target;
		}
	return newSel;
	}

/*
	*/
function getChildIndex( element) {
	return Array.prototype.indexOf.call( element.parentNode.childNodes, element);
	}

/*
	*/
function getFirstTableRow( element) {
	let report = null;
	do {
		if (element == null) break;
		if (element.parentNode.childNodes.length == 0) break;
		report = element.parentNode.childNodes[ 0];
		if (report.constructor.name == "Text" && element.parentNode.childNodes.length >= 2) {
			report = element.parentNode.childNodes[ 1];
			}
		}
	while(false);
	return report;
	}

/*
	*/
function getLastTableRow( element) {
	let report = null;
	do {
		if (element == null) break;
		if (element.parentNode.childNodes.length == 0) break;
		report = element.parentNode.childNodes[ element.parentNode.childNodes.length-1];
		}
	while(false);
	return report;
	}
	
/*
	*/
function getPreviousTableRow( element) {
	let report = null;
	do {
		if (element == null) break;
		let index = Array.prototype.indexOf.call( element.parentNode.childNodes, element);		
		if (index >= 1) report = element.parentNode.childNodes[ index-1];
		}
	while(false);
	return report;
	}
/*
	*/
function getNextTableRow( element) {
	let report = null;
	do {
		if (element == null) break;
		let index = Array.prototype.indexOf.call( element.parentNode.childNodes, element);
		if (index < (element.parentNode.childNodes.length-1)) report = element.parentNode.childNodes[ index+1];
		}
	while(false);
	return report;
	}
	  
/*
	*/
function getStationTypeName( stationType) {
	let stationTypeName = "Inconnu";
	switch (stationType) {
		case 0 : { stationTypeName = "Inconnu"; break;}
		case 1 : { stationTypeName = "Piéton"; break;}
		case 2 : { stationTypeName = "Cycliste"; break;}
		case 3 : { stationTypeName = "mobylette"; break;}
		case 4 : { stationTypeName = "moto"; break;}
		case 5 : { stationTypeName = "Voiture"; break;}
		case 6 : { stationTypeName = "VTC"; break;}
		case 7 : { stationTypeName = "Camionnette"; break;}
		case 8 : { stationTypeName = "Camion"; break;}
		case 9 : { stationTypeName = "Semi-remorque"; break;}
		case 10 : { stationTypeName = "Spécial"; break;}
		case 11 : { stationTypeName = "Tramway"; break;}
		case 15 : { stationTypeName = "UBR"; break;}
		default: { stationTypeName = "Inconnu"; break;}
		}
	return stationTypeName;
	}

/*
	*/
function getDocSize() {
	return { 'w': $(document).width(), 'h': $(document).height() };	
	}

/*
	*/
function xmlToJson( xmlNode) {
	let xText = "";
	if (xmlNode.firstChild && xmlNode.firstChild.nodeType === 3) 
		xText = xmlNode.firstChild.textContent;
	else 
		xText = '';
	return { 
		text: xText,
			children: [...xmlNode.children].map( childNode => xmlToJson( childNode))
		};
	}
	
			
/*
	*/
function getNodePath( node) {
	let report = "";
	if (node.farXml) report = node.farXml.nodeName;
	let n = node;
	while( n.parentNode) {
		if (n.parentNode.farXml) {
			report = n.parentNode.farXml.nodeName + "/" + report;
			}
		n = n.parentNode;
		}
	return report;
	}

/*
	*/
var _FPSList = {};

function FPSDeclare( name, maxDurationMs) {
	_FPSList[ name] = { frameCounter: 0, maxDurationMs: maxDurationMs, frames: [] };
	}

function FPSAdd( name) {
	do {
		if (name == undefined) {
			let a = 1;
			}
		if ( _FPSList[ name] == undefined) _FPSList[ name] = { frameCounter: 0, maxDurationMs: 60000, frames: [] };
		_FPSList[ name].frameCounter ++;
		
		let now = new Date();
		_FPSList[ name].frames.push( { index: _FPSList[ name].frameCounter, date: now.getTime() });
		
		while( (now.getTime() - _FPSList[ name].frames[0].date) > _FPSList[ name].maxDurationMs) {
			_FPSList[ name].frames.splice( 0, 1);
			}
		}
	while( false);
	}
	
function FPSGet( name) {
	let FPS = -1;
	if ( _FPSList[ name] != undefined) {
		let len = _FPSList[ name].frames.length;
		if (len > 1) {
			FPS = ((_FPSList[ name].frames[len-1].index - _FPSList[ name].frames[0].index) / (_FPSList[ name].frames[len-1].date - _FPSList[ name].frames[0].date)) * 1000;
			}
		}
	return FPS;
	}
	
function FPSDump() {
	let keys = Object.keys( _FPSList);
	let report = "";
	for( let k=0; k < keys.length; k++) {
		let fpsItem = _FPSList[ keys[k]];
		report += `${keys[k]}: ${FPSGet( keys[k])}\n`;
		}
	return report;
	}

/*
	*/
function isNumber(value) {
	return typeof value === 'number' && isFinite(value);
}