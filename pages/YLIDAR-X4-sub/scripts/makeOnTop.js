/*	makeOnTop.js
	permet à un élément de passer au dessus lorsqu'on clique dessus;
	*/

function makeOnTop( selId, divWin) {
	let selElem = $(selId);
	selElem.click( function( event){
		setWinOnTop( divWin);
		});
	}