/*
	zindex management
	*/
	
/* FPI,MOD,2020-04-22
var _zindex = 0;

function getZindex() {
	_zindex++;
	return _zindex;
	}
	
function setWinElementZIndex( winElement) {
	winElement.style['z-index'] = getZindex();
	}

function setWinOnTop( winElement) {
	winElement.style['z-index'] = getZindex();
	}*/

var _zindex = 0;

function getZindex() {
	_zindex++;
	return _zindex;
	}

var _lastTopElement = undefined;
function setWinElementZIndex( winElement) {

	if (_lastTopElement) {
		let oldIdx = window.getComputedStyle( _lastTopElement)["z-index"];
		_lastTopElement.style['z-index'] = 0;
		// console.debug( _lastTopElement.id + " switches to " + window.getComputedStyle( _lastTopElement)["z-index"]);
		_lastTopElement = undefined;
		}
	let prevIdx = window.getComputedStyle( winElement)["z-index"];
	winElement.style['z-index'] = 10;	
	_lastTopElement = winElement;
	// console.debug( _lastTopElement.id + " switches from " + prevIdx + " to " + window.getComputedStyle( _lastTopElement)["z-index"]);
	}

/*
	*/
function setWinOnTop( winElement) {
	let oldIdx = window.getComputedStyle( winElement)["z-index"];
	setWinElementZIndex( winElement);
	}