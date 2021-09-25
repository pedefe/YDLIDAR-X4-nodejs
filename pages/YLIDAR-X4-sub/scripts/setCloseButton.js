/* able to close window with a button
	- add method to hide/show the object
	
	*/
function setCloseButton( instance, buttonElement, winElement, parentElement) {
	
	instance._isClosed = false;

	/* rajoute une methode 'show'
		*/
	instance.show = function ( toShow) {
		
		instance._isClosed = (! toShow);
		instance.divWin.style.visibility = toShow ? "visible" : "hidden";
		if (onAppShowChange) onAppShowChange(  instance, toShow);
		if (this.onAppShowChange) this.onAppShowChange( toShow);
		if (toShow == true) {
			setWinOnTop( instance.divWin);
			}
		}

	/*  click on close button
		*/
	buttonElement.addEventListener( "mousedown", function( event) {
		eventStop( event);
		
		winElement.style.visibility = "hidden";
		instance._isClosed = true;
		if (onAppShowChange) onAppShowChange(  instance, false);
		if (this.onAppShowChange) this.onAppShowChange( false);
		});
	
	/* test if window is closed
		*/
	instance.isClosed = function () {
		return instance._isClosed;
		}
	}