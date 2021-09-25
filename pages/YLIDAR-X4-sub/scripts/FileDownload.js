/* FileDownload.js
		>>> view file content
	*/

function FileDownload( 
	resourcePath,
	parent,
	id,
	gridMgId) {
	
	this.id = id;
	let self = this;
	
	let icon_close = resourcePath + "/medias/cross-lightblue.png";
	
	let content = "\
<div id='FileDownload_Win' class='myShape myRounded4 myMovingWindow myResizable' style='width: 500px;'>\
	<div id='FileDownload_Header' class='myAreaCaption'>\
		<span id='FileDownload_Header_caption' class='myAreaCaptionText'>Vue de Fichiers</span>\
		<img class='closeButton' id='FileDownload_close' src='{0}'></img>\
 	</div>\
	<div id='FileDownload_Area' class='myInternal myAreaContainer' style='height: calc(100% - 26px);'>\
		<table id='FileDownload_table' class='myInternalWidth myTableCollapse' style='overflow-y:scroll; overflow-x:hidden;'>\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_labBytesCount' class='myItemLabel'>Octets à extraire:</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter'>\
					<input id='FileDownload_valBytesCount' type='text' class='myItemInput myInternal myBorderNone' value='30000'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_spat_mobile_params' class='myItemLabel'>Module SPaT-MAP, paramètres spat_mobile_params.xml:</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_spat_mobile_params' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_map_params' class='myItemLabel'>Module SPaT-MAP, map_params.json:</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_map_params' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_var_log_syslog' class='myItemLabel'>/var/log/syslog</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_var_log_syslog' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_var_log_debug' class='myItemLabel'>/var/log/debug</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_var_log_debug' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_var_log_daemon_log' class='myItemLabel'>/var/log/daemon.log</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_var_log_daemon_log' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_updateubr_release_story_txt' class='myItemLabel'>/var/log/updateubr_release_story.txt</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_updateubr_release_story_txt' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_spat_mobile_msg_detections_log' class='myItemLabel'>/var/log/spat_mobile_msg_detections.log</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_spat_mobile_msg_detections_log' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_var_run_spat_mobile_infos_json' class='myItemLabel'>/var/run/spat_mobile_infos.json</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_run_spat_mobile_infos_json' type='button' class='roundedButton' value='Download...'></input>\
				</td>\
			</tr>\
			\
			<tr>\
				<td class='myCellBorderAll myCellHCenter' style='width: 80%;'>\
					<label id='FileDownload_lab_fullConfiguration' class='myItemLabel'>Sauvegarder la configuration</label>\
				</td>\
				<td class='myCellBorderAll myCellHCenter' style='align='center;'>\
					<input id='FileDownload_val_fullConfiguration' type='button' class='roundedButton' value='Download...' title='télécharger un zip des fichiers de configuration pour archivage'></input>\
				</td>\
			</tr>\
		</table>\
		<div>\
			<label id='FileDownload_valLog' class='myItemValue'></label>\
		</div>\
	</div>\
	<div class='myResizers'>\
		<div class='myResizer bottom-right'></div>\
	</div>\
</div>".format( icon_close);
	
	parent.insertAdjacentHTML( 'beforeend', content);
	
	initiateWin( self, "#FileDownload_Win", "#FileDownload_Header", "#FileDownload_Header_caption", "#FileDownload_close", "#FileDownload_Area", gridMgId );

	/*this.divWin =  $("#FileDownload_Win")[0];
	
	dragElement( this, $("#FileDownload_Win")[0], $("#FileDownload_Header")[0], $("#FileDownload_Header_caption")[0]);
	makeResizableDiv( '#FileDownload_Win', { minimumSizeX: 200, minimumSizeY: 100} );
	setWinElementZIndex( $("#FileDownload_Win")[0]);
	makeMinMaxDiv( $("#FileDownload_Win")[0], { minWidth:"300px", minHeight:"28px" } );*/
	
	this.translate();
		
	$("#FileDownload_val_spat_mobile_params").click( { 'me': this }, function( event){
		do {
			_HttpInterface.sendHttpGetFile( "/spatModuleParamToDownload", "spat_mobile_params.xml", self.process_spat_mobile_params_xml);
			return false;
			}
		while(false);
		});
		
	$("#FileDownload_val_map_params").click( { 'me': this }, function( event){
		do {
			_HttpInterface.sendHttpGetFile( "/mapFileToDownload", "map_params.json", self.process_map_params_json);
			return false;
			}
		while(false);
		});
		
	$("#FileDownload_val_var_log_syslog").click( { 'me': this }, function( event){
		do {
			var sizeInBytes = parseInt( $("#FileDownload_valBytesCount")[0].value);
			var filePath = "/var/log/syslog";
			var request = "/filePartToDownload?" + 
				"sizeInBytes=" + sizeInBytes.toString() +
				"&filePath=" + filePath;
			_HttpInterface.sendHttpGetFile( request, filePath, self.process_file_part);
			return false;
			}
		while(false);
		});
		
	$("#FileDownload_val_var_log_debug").click( { 'me': this }, function( event){
		do {
			var sizeInBytes = parseInt( $("#FileDownload_valBytesCount")[0].value);
			var filePath = "/var/log/debug";
			var request = "/filePartToDownload?" + 
				"sizeInBytes=" + sizeInBytes.toString() +
				"&filePath=" + filePath;
			_HttpInterface.sendHttpGetFile( request, filePath, self.process_file_part);
			return false;
			}
		while(false);
		});
		
	$("#FileDownload_val_var_log_daemon_log").click( { 'me': this }, function( event){
		do {
			var sizeInBytes = parseInt( $("#FileDownload_valBytesCount")[0].value);
			var filePath = "/var/log/daemon.log";
			var request = "/filePartToDownload?" + 
				"sizeInBytes=" + sizeInBytes.toString() +
				"&filePath=" + filePath;
			_HttpInterface.sendHttpGetFile( request, filePath, self.process_file_part);
			return false;
			}
		while(false);
		});
		
	$("#FileDownload_val_updateubr_release_story_txt").click( { 'me': this }, function( event){
		do {
			var sizeInBytes = parseInt( $("#FileDownload_valBytesCount")[0].value);
			var filePath = "/var/log/updateubr_release_story.txt";
			var request = "/filePartToDownload?" + 
				"sizeInBytes=" + sizeInBytes.toString() +
				"&filePath=" + filePath;
			_HttpInterface.sendHttpGetFile( request, filePath, self.process_file_part);
			return false;
			}
		while(false);
		});
		
	$("#FileDownload_val_spat_mobile_msg_detections_log").click( { 'me': this }, function( event){
		do {
			var sizeInBytes = parseInt( $("#FileDownload_valBytesCount")[0].value);
			var filePath = "/var/log/spat_mobile_msg_detections.log";
			var request = "/filePartToDownload?" + 
				"sizeInBytes=" + sizeInBytes.toString() +
				"&filePath=" + filePath;
			_HttpInterface.sendHttpGetFile( request, filePath, self.process_file_part);
			return false;
			}
		while(false);
		});
		
	$("#FileDownload_val_run_spat_mobile_infos_json").click( { 'me': this }, function( event){
		do {
			var sizeInBytes = parseInt( $("#FileDownload_valBytesCount")[0].value);
			var filePath = "/var/run/spat_mobile_infos.json";
			var request = "/filePartToDownload?" + 
				"sizeInBytes=" + sizeInBytes.toString() +
				"&filePath=" + filePath;
			_HttpInterface.sendHttpGetFile( request, filePath, self.process_file_part);
			return false;
			}
		while(false);
		});
		
	/*
		*/
	$("#FileDownload_val_fullConfiguration").click( { 'me': this }, function( event){
		do {
			self.log('construction de UBRConfig.zip ...patientez');
			
			let currentStation = _yogokoHandler.getCurrentStation();
			let fileName = 'UBRConfig.zip';
			if (currentStation) {
				fileName = 'UBRConfig-{0}.zip'.format( currentStation.currentData.stationID);
				}
			
			const Http = new XMLHttpRequest();
			const url = 'http://' + _hostAddress + ':' + _hostPort.toString() + "/System.Config.Save";
			
			Http.onreadystatechange = function() {
				if (Http.readyState === 4 && this.status == 200) {
					var ty = this.responseType;
					// var decoded = decodeURIComponent( this.response);
					var blob = new Blob( [this.response], {type: "octet/stream"} );
				
					saveData( blob, fileName);
					self.log("config sauvegardée dans {0}".format( fileName));
					}
				};
	
			// vital !!!
			Http.responseType = "arraybuffer";
			Http.open("GET", url, true);
			Http.send( null);
			
			return false;
			}
		while(false);
		});
	}

/* FileDownload.prototype.move = function( left, top) {
	this.divWin.style.left = left;
	this.divWin.style.top = top;
	}

FileDownload.prototype.size = function( width, height) {
	this.divWin.style.width = width;
	this.divWin.style.height = height;
	}*/
	
/*
	*/
FileDownload.prototype.translate = function() { 
	switch( _Lang._lang) {
		case "fr": {
			$("#FileDownload_Header_caption")[0].innerText = "Vue de Fichiers";
			
			$("#FileDownload_labBytesCount")[0].innerText = "Octets à extraire:";
			$("#FileDownload_lab_spat_mobile_params")[0].innerText = "Module SPaT-MAP, fichier paramètres spat_mobile_params.xml:";
			$("#FileDownload_lab_map_params")[0].innerText = "Module SPaT-MAP, map_params.json:";
			
			break;
			}
		case "en": {
			$("#FileDownload_Header_caption")[0].innerText = "Files View";

			$("#FileDownload_labBytesCount")[0].innerText = "Bytes count:";
			$("#FileDownload_lab_spat_mobile_params")[0].innerText = "Module SPaT-MAP, settings file spat_mobile_params.xml:";
			$("#FileDownload_lab_map_params")[0].innerText = "Module SPaT-MAP, map_params.json:";
			break;
			}
		}
	}

/*
		*/
FileDownload.prototype.triggerResize = function() { 
	
	}
	
/*
	*/
FileDownload.prototype.log = function(t) { 
	$("#FileDownload_valLog")[0].innerText = new Date().yyyymmddhhmmss() + " > " + t;
	}


/*
	*/
FileDownload.prototype.process_file_part = function( fileDescription, HttpResponseText) {
	
	var newValue = "";
	try {
		var jsnResponse = JSON.parse( HttpResponseText);
		newValue = jsnResponse.comment;
		}
	catch(err) {
		newValue = err;
		}      

	var newWindow = window.open("", "_blank");
	newWindow.focus();
	var xStyle = "'width:100%; height:95%; -moz-tab-size : 2; -o-tab-size : 2; tab-size : 2;'";
	newWindow.document.write( "<label>" + fileDescription + "</label>");
	newWindow.document.write( "</br>");
	newWindow.document.write( "<textArea id='idText' style=" + xStyle + "></textArea>" );
	newWindow.document.getElementById( 'idText').value = newValue;
	newWindow.document.title = fileDescription;
	}
	
/*
	*/
FileDownload.prototype.process_spat_mobile_params_xml = function( fileDescription, fileContent) {
	var newWindow = window.open("", "_blank");
	newWindow.focus();
	var xStyle = "'width:95%;height:95%; -moz-tab-size : 2; -o-tab-size : 2; tab-size : 2;'";
	newWindow.document.write( "<label>" + fileDescription + "</label>");
	newWindow.document.write( "</br>");
	newWindow.document.write( "<textArea id='idText' style=" + xStyle + "></textArea>" );
	newWindow.document.getElementById( 'idText').value = fileContent;
	newWindow.document.title = "spat_mobile_params.xml";
	}
	
/* que faire quand on reçoit le fichier map_param.json
	*/
FileDownload.prototype.process_map_params_json = function( fileDescription, fileContent) {
	var newWindow = window.open("", "_blank");
	newWindow.focus();
	var xStyle = "'width:95%; height:95%; -moz-tab-size : 2; -o-tab-size : 2; tab-size : 2;'";
	newWindow.document.write( "<label>map_params.json</label>");
	newWindow.document.write( "</br>");
	newWindow.document.write( "<textArea id='idText' style=" + xStyle + "></textArea>" );
	newWindow.document.getElementById( 'idText').value = fileContent;
	newWindow.document.title = "map_param.json";
	}