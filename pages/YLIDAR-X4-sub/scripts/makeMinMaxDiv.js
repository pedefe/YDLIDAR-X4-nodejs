/*	makeMinMaxDivjs
	>>> permet de réduire au min / normal une div
	*/
function makeMinMaxDiv( divWin, options) {
	
	let content = "\
	<div class='myResizers'>\
		<div class='myResizer min-max' id='{0}_minSize'></div>\
	</div>".format( divWin.id);
	
	divWin.insertAdjacentHTML( 'beforeend', content);
	let sel = "#{0}_minSize".format( divWin.id);
	let elementMinMax = $(sel)[0];
	elementMinMax.farO = divWin.farO;
	
	divWin.farO.minWidth = options.minWidth;
	divWin.farO.minHeight = options.minHeight;
	
	divWin.farO.minSize = false;
	
	$("#" + elementMinMax.id).click( function( event){
		
		// let self = event.data.me;
		let self = event.currentTarget.farO;

		if (self.minSize == false) {
			
			self.normalWidth = window.getComputedStyle( divWin).width;
			self.normalHeight = window.getComputedStyle( divWin).height;
			
			divWin.style.width = self.minWidth;
			divWin.style.height = self.minHeight;

			self.minSize = true;
			
			if (self.triggerResize) self.triggerResize();
			}
		else {
			divWin.style.width = self.normalWidth;
			divWin.style.height = self.normalHeight;
	
			self.minSize = false;
			
			if (self.triggerResize) self.triggerResize();
			}
		});
	}