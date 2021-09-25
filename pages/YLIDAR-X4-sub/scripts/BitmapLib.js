/*	BitmapLib.js
	>>>> accès bufferisé aux ressources
	*/

/*
	*/
var _imagesMap = new Map();

function loadImageInElement( element, key, imageResource) {
	let img = null;
	if (_imagesMap.has(key) == false) {
		img = new Image();
		img.src = imageResource;
		_imagesMap.set( key, img);
		}
	else {
		img = _imagesMap.get( key);
		}
	if (element) {
		element.src = img.src;
		}
	return img;
	}

/*
	*/
function getImage( key) {
	let img = null;
	if (_imagesMap.has(key))  img = _imagesMap.get( key);
	return img;
	}