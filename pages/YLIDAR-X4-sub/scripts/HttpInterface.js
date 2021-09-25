/*	HttpInterface.js
	2020-03-31, FPI, 
		> creation
	*/

function HttpInterface( hostAddress, hostPort) {
	this.hostAddress = hostAddress,
	this.hostPort = hostPort;
	}
	
/*
	*/
HttpInterface.prototype.sendHttpRequest = function( request, responseElement, postProcessingFunc) {
	const Http = new XMLHttpRequest();
	const url='http://' + this.hostAddress + ':' + this.hostPort.toString() + request;
	Http.onreadystatechange = function(e) {
		if (this.readyState == 4 && this.status == 200) {
			// if (_Logs != undefined) _Logs.log( request + ", bilan : " + Http.responseText);
			var jsnResponse = null;
			var newValue = null;
			try {
				jsnResponse = JSON.parse( Http.responseText);
				if (jsnResponse.newValue != undefined) {
					newValue = jsnResponse.newValue;
					}
				else if (jsnResponse.comment != undefined) {
					if (isJson( jsnResponse.comment)) newValue = JSON.stringify( jsnResponse.comment);
					else newValue = jsnResponse.comment;
					}
				}
			catch(err) {
				newValue = Http.responseText;
				}
				
			if (responseElement != undefined) {
				if (responseElement.value != undefined) responseElement.value = newValue;
				else if (responseElement.innerText != undefined) responseElement.innerText = newValue;
				}
			else if (postProcessingFunc != undefined) {
				postProcessingFunc( newValue);
				}
			}
		}
	Http.open("GET", url, true);
	Http.send(null);
	}


/*
	*/
HttpInterface.prototype.sendHttpGetFile = function( request, fileDescription, postProcessingFuncText, postProcessingFuncBin) {
	const Http = new XMLHttpRequest();
	const url = 'http://' + _hostAddress + ':' + _hostPort.toString() + request;
	Http.onreadystatechange = function(e) {
		if (this.readyState == 4 && this.status == 200) {
			if (_Logs != undefined) _Logs.log( request + ", bilan : " + fileDescription + " chargé.");
			
			if (postProcessingFuncText != undefined) {
				postProcessingFuncText( fileDescription, Http.responseText);
				}

			if (postProcessingFuncBin != undefined) {
				var blob = new Blob( [this.response], {type: "octet/stream"} );
				postProcessingFuncBin( fileDescription, blob);
				}
			}
		}
	if (postProcessingFuncBin != undefined) {
		Http.responseType = "arraybuffer";
		}
	Http.open("GET", url, true);
	Http.send(null);
	}

/*
	*/
HttpInterface.prototype.sendHttpPostJson = function( request, jsn, requestDescription, postProcessingFunc) {
	const Http = new XMLHttpRequest();
	const url = 'http://' + _hostAddress + ':' + _hostPort.toString() + request;
	Http.onreadystatechange = function(e) {
		if (this.readyState == 4 && this.status == 200) {
			
			if (_Logs) _Logs.log( 'request : ' + requestDescription + ", bilan : " + Http.responseText);

			var json = JSON.parse( Http.responseText);
			
			if (postProcessingFunc != undefined) {
				postProcessingFunc( requestDescription, Http.responseText);
				}
			}
		}
	Http.open("POST", url, true);
	Http.setRequestHeader("Content-Type", "application/json");
	var strJsn = JSON.stringify( jsn );
	Http.send( strJsn);
	}
	
/*
	*/
HttpInterface.prototype.sendHttpData = function( data, url, responseElement, postProcessingFunc) {
	
	var oReq = new XMLHttpRequest();
	oReq.open("POST", url, true);
	oReq.onload = function (oEvent) {
		var rep = oReq.response;
		if (_Logs) _Logs.log( rep);
		};

	var blob = new Blob( [ data ], {type: 'image/png'});
	oReq.send(blob);
	}
	
/*
	*/
HttpInterface.prototype.sendHttpPostText = function( request, text, requestDescription, postProcessingFunc) {
	const Http = new XMLHttpRequest();
	const url = 'http://' + _hostAddress + ':' + _hostPort.toString() + request;
	Http.onreadystatechange = function(e) {
		if (this.readyState == 4 && this.status == 200) {
								
			if (_Logs) _Logs.log( 'request : ' + requestDescription + ", bilan : " + Http.responseText);

			let json = JSON.parse( Http.responseText);
			
			if (postProcessingFunc != undefined) {
				postProcessingFunc( requestDescription, Http.responseText);
				}
			}
		}
	Http.open("POST", url, true);
	Http.setRequestHeader("Content-Type", "application/json");
	Http.send( text);
	}