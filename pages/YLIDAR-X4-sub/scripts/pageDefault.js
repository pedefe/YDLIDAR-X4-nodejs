/*	pageDefault.js
		standard actions
	*/
	
var _mouseX = 0;
var _mouseY = 0;

/*
	*/
function preparePage() {

	/**/
	$(document).mousemove(function( event) {
		_mouseX = event.pageX;
		_mouseY = event.pageY;
		//}).mouseover(); // call the handler immediately
		}).mousemove(); // call the handler immediately


	// disable the default browser's context menu.
	$(document).bind("contextmenu", function (event) {
		event.stopPropagation();
		event.preventDefault();
		return false;
		});
		
	// disable the default browser's context menu.
	$(document).bind("contextmenu", function (e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
		});
	
	// prevent from d&d
	document.body.addEventListener("dragover", function(e) {
		e.preventDefault();
		}, 
		false);
		
	document.body.addEventListener("drop", function(e) {
		e.preventDefault();
		}, 
		false);

	// pas de sélection du texte de la page
	if (typeof document.onselectstart != "undefined") {
		document.onselectstart = new Function ("return false");
		}
	else{
		document.onmousedown = new Function ("return false");
		document.onmouseup = new Function ("return true");
		}
		
	/* on peut atteindre le debugger par le menu
	document.addEventListener("keydown", function(e){
		// THIS WILL ONLY DISABLE F12
		if (e.keyCode==123) {
			e.stopPropagation();
			e.preventDefault();
			}
		});*/
	}