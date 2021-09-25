/* able to drag window
	https://www.w3schools.com/howto/howto_js_draggable.asp
	
	*/
/* pour détecter les changement de classe 
	https://developer.mozilla.org/fr/docs/Web/API/MutationObserver
	*/
/*var _observer = new MutationObserver( function(mutations) {
	mutations.forEach( function( mutation) {
		if (mutation.attributeName === "class") {
			var attributeValue = $(mutation.target).prop( mutation.attributeName);
			console.log("On target" + mutation.target.id + ", Class attribute changed to: ", attributeValue);
		}
		if (mutation.attributeName === "style") {
			var attributeValue = $(mutation.target).prop( mutation.attributeName);
			console.log("On target" + mutation.target.id + ", Style attribute changed to: ", attributeValue);
		}
	});
});

_observer.observe( row, { attributes: true, attributeFilter : ['style']} );
*/

function dragElement( instance, winElement, winElementHeader, winElementHeaderCaption, gridMgId) {
	
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	
	winElement.farO = instance;
	if (gridMgId != undefined) {
		winElement.farO.gridManager = $("#" + gridMgId)[0].gridManager;	
		}
	winElementHeaderCaption.farO = instance;	
	
	winElementHeader.onmousedown = headerMouseDown;
	
	winElementHeaderCaption.onmousedown = dragMouseDown;
	instance.isDragging = false;

	winElementHeaderCaption.onmousemove = function( event) {
		// console.debug( "id=" + event.currentTarget.id + ", cursor=" + window.getComputedStyle( event.currentTarget).cursor);
		}
	
	function headerMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		
		/* FPI,MOD,2020-04-22
		winElement.style['z-index'] = getZindex()*/
		setWinElementZIndex( winElement);
		}
		
	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		
		/* FPI,MOD,2020-04-22
		winElement.style['z-index'] = getZindex();
		setWinElementZIndex( winElement);*/

		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;

		/* FPI,MOD,2020-04-22
		document.onmouseup = closeDragElement;*/
		document.addEventListener('mouseup', closeDragElement);

		// call a function whenever the cursor moves:
		/* FPI,MOD,2020-04-22
		document.onmousemove = dragMouseMove;*/
		document.addEventListener('mousemove', dragMouseMove);
		
		instance.isDragging = true;
		}
  
	function dragMouseMove(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		winElement.style.top = (winElement.offsetTop - pos2) + "px";
		winElement.style.left = (winElement.offsetLeft - pos1) + "px";
		}
  
	function closeDragElement(e) {
		// stop moving when mouse button is released:
		/*FPI,MOD,2020-04-22
		document.onmouseup = null;
		document.onmousemove = null;*/
		document.removeEventListener('mouseup', closeDragElement);
		document.removeEventListener('mousemove', dragMouseMove);

		instance.isDragging = false;
		
		if (winElement.farO.gridManager 
			&& winElement.farO.gridManager.onMouseUpCB) {
			winElement.farO.gridManager.onMouseUpCB( winElement, e.ctrlKey);
			}
		}
  }

  
/* Rattacher un gridManager à posteriori
	
function dragElement_declareGridManager( winElement, gridMgId) {
	
	if (gridMgId != undefined
		&& winElement.farO) {
		winElement.farO.gridManager = $("#" + gridMgId)[0].gridManager;	
		}
	}*/
