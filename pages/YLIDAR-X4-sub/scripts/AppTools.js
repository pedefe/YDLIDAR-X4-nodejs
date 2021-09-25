/* AppTools.js
		>>> outils pour l'interface web
	2020-03-31, FPI
		> creation
	*/

function AppTools( 
	resourcePath,
	parent,
	id,
	gridMgId,
	callback) {
	
	this.id = id;
	let self = this;

	let icon_save = resourcePath + "/medias/icon_save.png";
	let icon_load = resourcePath + "/medias/icon_load.png";
	let icon_reset = resourcePath + "/medias/icon_reload.png";
	// let icon_mapSave = resourcePath + "/medias/map_save.png";
	let icon_mapSave = resourcePath + "/medias/icon_save.png";

	let icon_close = resourcePath + "/medias/cross-lightblue.png";
	
	let content = "\
<div id='AppTools_Win' class='myShape myRounded4 myMovingWindow myResizable' style='width: 500px;'>\
	<div id='AppTools_Header' class='myAreaCaption'>\
		<span id='AppTools_Header_caption' class='myAreaCaptionText'>AutoMove-U.I. (ctrl+u)</span>\
		<img class='closeButton' id='AppTools_close' src='{0}'></img>\
	</div>\
	<div id='AppTools_Area' class='myInternal myAreaContainer' style='height: calc(100% - 26px);'>\
		<table>\
			<tr>\
				<!--td>\
					<label id='AppTools_labConnected' class='myItemLabel'>Serveur:</label>\
				</td>\
				<td class='myCellHCenter'>\
					<input type='checkbox' id='AppTools_valConnected'></input>\
				</td-->\
				<td>\
					<input id='AppTools_save' type='button' class='roundedButton' value='' style='background: url({1}); background-size: 25px 25px; background-repeat: no-repeat; padding: 0px 12px;' title='sauvegarder la position des fenêtres'></input>\
				</td>\
				<td>\
					<input id='AppTools_load' type='button' class='roundedButton' value='' style='background: url({2}); background-size: 25px 25px; background-repeat: no-repeat; padding: 0px 12px;' title='charger la position des fenêtres'></input>\
				</td>\
				<td>\
					<input id='AppTools_reset' type='button' class='roundedButton' value='' style='background: url({3}); background-size: 25px 25px; background-repeat: no-repeat; padding: 0px 12px;' title='position des fenêtres aléatoire'></input>\
				</td>\
				<td>\
					<label class='myItemLabel' >FR/EN</label> \
					<label class='switch' >\
						<input type='checkbox' id='AppTools_Lang'></input>\
						<span class='slider round myCellHCenter' title='changer de langue'></span>\
					</label> \
				</td>\
				<td>\
					<input id='AppTools_mapSave' type='button' class='roundedButton tooltip' value='' style='background: url({4}); background-size: 25px 25px; background-repeat: no-repeat; padding: 0px 12px;' title='Sauvegarder les tuiles de la carte'></input>\
				</td>\
			</tr>\
		</table>\
	</div>\
	<div class='myResizers'>\
		<div class='myResizer bottom-right'></div>\
	</div>\
</div>".format( icon_close, icon_save, icon_load, icon_reset, icon_mapSave);
	
	parent.insertAdjacentHTML( 'beforeend', content);
	
	initiateWin( self, "#AppTools_Win", "#AppTools_Header", "#AppTools_Header_caption", "#AppTools_close", "#AppTools_Area", gridMgId );

	this.translate();
	
	this.callback = callback;
	
	$("#AppTools_save").click( { 'me': this }, function( event){
		eventStop( event);
		if (callback != undefined) callback ( { 'event': 'parameters.positions.save' } );
		});
		
	$("#AppTools_load").click( { 'me': this }, function( event){
		eventStop( event);
		if (callback != undefined) callback ( { 'event': 'parameters.positions.load' } );
		});	
		
	$("#AppTools_reset").click( { 'me': this }, function( event){
		eventStop( event);
		if (callback != undefined) callback ( { 'event': 'parameters.positions.reset' } );
		});
		
	$("#AppTools_Lang")[0].addEventListener( 'change', function(event) {
		eventStop( event);
		if (_Lang) _Lang.switchLanguage( event.target.checked ? "en" : "fr");
		});
		
	$("#AppTools_mapSave").click( { 'me': this }, function( event){
		eventStop( event);
		if (_MapGPS != undefined) _MapGPS.saveTiles();
		});
	}


/*AppTools.prototype.move = function( left, top) {
	this.divWin.style.left = left;
	this.divWin.style.top = top;
	}

AppTools.prototype.size = function( width, height) {
	this.divWin.style.width = width;
	this.divWin.style.height = height;
	}*/
	
/*
	*/
AppTools.prototype.translate = function() { 
	}
	
AppTools.prototype.triggerResize = function() { 	
	}

/*
	*/
AppTools.prototype.setUser = function( jsnUser) { 
	$("#AppTools_Header_caption")[0].innerText = "NEXO-Superviseur-Interface Utilisateur [{0}]".format( jsnUser.settings.userName);
	}
