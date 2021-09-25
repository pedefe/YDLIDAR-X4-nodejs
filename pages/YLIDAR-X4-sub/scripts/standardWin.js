/*	standardWin.js
	Rassemble la gestion des fenêtres divWin
	*/
			
/*
	*/
function initiateWin(
	me,
	divWinSelName,
	divWinHeaderSelName,
	divWinHeaderCaptionSelName,
	divWinCloseSelName,
	divWinAreaSelName,
	gridMgId,
	callbackResized ) {
	
	me.divWin = $(divWinSelName)[0];
	dragElement( me, $(divWinSelName)[0], $(divWinHeaderSelName)[0], $(divWinHeaderCaptionSelName)[0], gridMgId);
	makeResizableDiv( divWinSelName, { minimumSizeX: 200, minimumSizeY: 100}, callbackResized, me );
	setWinElementZIndex( $(divWinSelName)[0]);
	makeMinMaxDiv( $(divWinSelName)[0], { minWidth:"300px", minHeight:"28px" } );
	setCloseButton( me, $(divWinCloseSelName)[0], $(divWinSelName)[0], parent);
	makeOnTop( divWinAreaSelName,  $(divWinSelName)[0]);
	manageSettings( me);
	}

/*
	stop propagation
	*/
function eventStop(event) {
	event.stopPropagation();
	event.preventDefault();
	}