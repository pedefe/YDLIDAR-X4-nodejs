/* able to collapse window part
		
	*/
function collapseWindow( instance, winElement, winElementHeader, winElementToCollapse) {
	
	winElement.farO = instance;
	winElementHeader.farO = instance;
	winElementToCollapse.farO = instance;

	winElementHeader.onmousedown = collapseMouseDown;
	instance.isCollapsing = false;
	
	/*
		*/
	function collapseMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		
		if (e.srcElement.farO.isDragging) return;

		/* FPI,MOD,2020-04-22
		winElement.style['z-index'] = getZindex();*/
		setWinElementZIndex( winElement);
		
		let display = window.getComputedStyle( winElementToCollapse).display;
		if (display === "") {
			winElementToCollapse.style.display = "none";
			}
		else if (display === "block") {
			winElementToCollapse.style.display = "none";
			} 
		else {
			winElementToCollapse.style.display = "block";
			}

		instance.isCollapsing = true;
		}

	/*
		*/
	function closeCollapse() {
	  	// stop moving when mouse button is released:
	  	document.onmouseup = null;
	  	document.onmousemove = null;
		
		instance.isCollapsing = false;
		}
  }