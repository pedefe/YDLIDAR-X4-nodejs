/*	resizeWindow.js
	*/


/* Make resizable div by Hung Nguyen
	*/
function makeResizableDiv( div, options, callbackResized, instance, gridMgId) {
	
	const element = document.querySelector( div);
	if (gridMgId != undefined) {
		element.farO.gridManager = $("#" + gridMgId)[0].gridManager;	
		}
	const resizers = document.querySelectorAll( div + ' .myResizer')
	let minimum_sizeX = 20;
	let minimum_sizeY = 20;
	if (options && options.minimumSizeX) minimum_sizeX = options.minimumSizeX;
	if (options && options.minimumSizeY) minimum_sizeY = options.minimumSizeY;
	
	let original_width = 0;
	let original_height = 0;
	let original_x = 0;
	let original_y = 0;
	let original_mouse_x = 0;
	let original_mouse_y = 0;
	
	for (let i = 0;i < resizers.length; i++) {
		const currentResizer = resizers[i];
		currentResizer.addEventListener('mousedown', function(e) {
			e.preventDefault()
			original_width = parseFloat( getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
			original_height = parseFloat( getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
			original_x = element.getBoundingClientRect().left;
			original_y = element.getBoundingClientRect().top;
			original_mouse_x = e.pageX;
			original_mouse_y = e.pageY;
			window.addEventListener('mousemove', resize);
			window.addEventListener('mouseup', stopResize);

			setWinOnTop( element);
		})
		
		function resize(e) {
			if (currentResizer.classList.contains('bottom-right')) {
				const width = original_width + (e.pageX - original_mouse_x);
				const height = original_height + (e.pageY - original_mouse_y)
				if (width > minimum_sizeX) {
					element.style.width = width + 'px'
				}
				if (height > minimum_sizeY) {
					element.style.height = height + 'px'
				}
				
				if (element.style.top.replace('px', '') < 0) element.style.top = "0px";
				if (element.style.left.replace('px', '') < 0) element.style.left = "0px";
			}
			else if (currentResizer.classList.contains('bottom-left')) {
				const height = original_height + (e.pageY - original_mouse_y)
				const width = original_width - (e.pageX - original_mouse_x)
				if (height > minimum_sizeY) {
					element.style.height = height + 'px'
				}
				if (width > minimum_sizeX) {
					element.style.width = width + 'px'
					element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
				}
			}
			else if (currentResizer.classList.contains('top-right')) {
				const width = original_width + (e.pageX - original_mouse_x)
				const height = original_height - (e.pageY - original_mouse_y)
				if (width > minimum_sizeX) {
					element.style.width = width + 'px'
				}
				if (height > minimum_sizeY) {
					element.style.height = height + 'px'
					element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
				}
			}
			else {
				const width = original_width - (e.pageX - original_mouse_x)
				const height = original_height - (e.pageY - original_mouse_y)
				if (width > minimum_sizeX) {
					element.style.width = width + 'px'
					element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
				}
				if (height > minimum_sizeY) {
					element.style.height = height + 'px'
					element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
				}
			}
			if (callbackResized != undefined) callbackResized( element);
			
			element.farO.normalWidth = window.getComputedStyle( element).width;
			element.farO.normalHeight = window.getComputedStyle( element).height;
		}
		
		/*
  			*/
		function stopResize(e) {
			window.removeEventListener('mousemove', resize);
			/* FPI,MOD,2020-04-22 */
			window.removeEventListener('mouseup', stopResize);
			
			if (element.farO.gridManager 
				&& element.farO.gridManager.stopResize) {
				element.farO.gridManager.stopResize( element, e.ctrlKey);
				}
				
			if (element.farO.sizeEx) {
				element.farO.sizeEx();
				}
			}		

		if (instance != undefined) {
			instance.getSize = function() {
				let w = parseFloat( getComputedStyle( element, null).getPropertyValue('width').replace('px', ''));
				let h = parseFloat( getComputedStyle( element, null).getPropertyValue('height').replace('px', ''));
				return { 'w': w, 'h': h};
			}
		}
	}

	/* fonction de déplacement
		*/
	if (element.farO.move == undefined) {
		element.farO.move = function( left, top) {
			this.divWin.style.left = left;
			this.divWin.style.top = top;
			if (element.farO.moveEx) {
				element.farO.moveEx();
			}
		}
	}
	if (element.farO.moveRel == undefined) {
		element.farO.moveRel = function( left, top) {
			let l = parseFloat( getComputedStyle( element, null).getPropertyValue('left').replace('px', ''));
			let t = parseFloat( getComputedStyle( element, null).getPropertyValue('top').replace('px', ''));
			
			let deltaL = left.replace('px', '');
			let deltaT = top.replace('px', '');
			
			this.divWin.style.left = l + deltaL;
			this.divWin.style.top = t + deltaT;
			if (element.farO.moveEx) {
				element.farO.moveEx();
			}
		}
	}

	/* fonction de redimensionnement
		*/
	if (element.farO.size == undefined) {
		element.farO.size = function( width, height) {
			this.divWin.style.width = width;
			this.divWin.style.height = height;
			if (element.farO.sizeEx) {
				element.farO.sizeEx();
			}
		}
	}	
	
	if (element.farO.getPos == undefined) {
		element.farO.getPos = function() {
			let bodyRect = document.body.getBoundingClientRect();
			let elemRect = element.getBoundingClientRect();
			return {
				left: elemRect.left - bodyRect.left,
				top: elemRect.top - bodyRect.top };
				
		}
	}
}

/* Rattacher un gridManager à posteriori
	
function makeResizableDiv_declareGridManager( div, gridMgId) {
	
	let element = document.querySelector( div);
	if (element
		&& element.farO
		&& gridMgId != undefined) {
		
		element.farO.gridManager = $("#" + gridMgId)[0].gridManager;	
		}
	}*/



/*	rend autodimensionnable la dernière partie d'une fenêtre, pour l'ajuster à son container

	*/
function setDynamicArea( containerAreaId, dynamicAreaId) {
	
	let containerSel = $("#" + containerAreaId);
	let container = $("#" + containerAreaId)[0];
	let dynamicArea = $("#" + dynamicAreaId)[0];
	// dynamicArea.style["transition"] = "transition: width 0.5s, height 0.5s";
	container.farDynamicElementId = dynamicAreaId;

	containerSel.resize( function(e) {

		setTimeout( function( event) {
			// win.addEventListener( "resize", function( event) {
			let containerRect = container.getBoundingClientRect();
			let containerTop = containerRect.top;
			let containerClientRect = container.getClientRects()[0];
			let containerClientHeight = containerClientRect.height;

			let dynamicAreaRect = dynamicArea.getBoundingClientRect();
			let dynamicAreaTop = dynamicAreaRect.top;
			let dynamicAreaRelativeTop = dynamicAreaTop - containerTop;

			/*console.log( '>>>');
			console.log( 'containerClientHeight = ' + containerClientHeight);
			console.log( 'dynamicAreaRelativeTop = ' + dynamicAreaRelativeTop );*/
			dynamicArea.style.height = (containerClientHeight - dynamicAreaRelativeTop - 5) + "px";
			//console.log( 'dynamicArea.style.height > ' + dynamicArea.getClientRects()[0].height);
			}, 200);
		});
	}