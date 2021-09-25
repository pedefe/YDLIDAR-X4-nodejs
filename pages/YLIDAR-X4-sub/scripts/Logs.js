/* Logs.js
		>>> bloc d'information sur l'unité courante
	*/

function Logs( 
	resourcePath,
	parent,
	id,
	gridMgId) {
	
	this.id = id;
	let self = this;

	let icon_close = resourcePath + "/medias/cross-lightblue.png";

	let content = "\
<div id='Logs_Win' class='myShape myRounded4 myMovingWindow myResizable' style='width: 1000px;'>\
	<div id='Logs_Header' class='myAreaCaption'>\
		<span id='Logs_Header_caption' class='myAreaCaptionText'>Logs (ctrl+l)</span>\
		<img class='closeButton' id='Logs_close' src='{0}'></img>\
	</div>\
	<div id='Logs_Area' class='myInternal myAreaContainer' style='height: calc(100% - 26px);'>\
		<div class='myInternalWidth' style:'height: 25px;'>\
			<input id='Logs_clear' type='button' class='roundedButton' value='Effacer'></input>\
		</div>\
		<div class='myInternalWidth'>\
			<table id='Logs_table' class='myTableCollapse myInternalWidth'>\
				<thead class='myBorderUD myBlock myInternalWidth'>\
					<tr>\
						<th id='Logs_stamp_header' class='myItemLabel' style='width: 200px; text-align: center;'>Horodate</th>\
						<th id='Logs_level_header' class='myItemLabel' style='width: 60px; text-align: center;'>Niveau</th>\
						<th id='Logs_msg_header' class='myItemLabel' style='width: 1500px; text-align: center;'>Message</th>\
					</tr>\
				</thead>\
				<tbody id='Logs_table_body' class='myInternalWidth myBlock' style='height: 50px; overflow-y:auto; overflow-x:hidden;'>\
				</tbody>\
			</table>\
		</div>\
	</div>\
	<div class='myResizers'>\
		<div class='myResizer bottom-right'></div>\
	</div>\
</div>".format( icon_close);
	
	parent.insertAdjacentHTML( 'beforeend', content);

	initiateWin( self, "#Logs_Win", "#Logs_Header", "#Logs_Header_caption", "#Logs_close", "#Logs_Area", gridMgId );

	this.translate();
	
	this.maxLines = 100;
	
	$("#Logs_clear").click( { 'me': this }, function( event){
		self.clearLogs();
		});

	setDynamicArea( "Logs_Area", "Logs_table_body");

	this.LogListManager = new ListManager( this, "Logs_table", "Logs_table_body", undefined, undefined);
	}

/*Logs.prototype.move = function( left, top) {
	this.divWin.style.left = left;
	this.divWin.style.top = top;
	}

Logs.prototype.size = function( width, height) {
	this.divWin.style.width = width;
	this.divWin.style.height = height;
	}*/
	
/*
	*/
Logs.prototype.translate = function() { 
	switch( _Lang._lang) {
		case "fr": {
			$("#Logs_Header_caption")[0].innerText = "Logs (ctrl+l)";
			
			$("#Logs_stamp_header")[0].innerText = "Horodate";
			$("#Logs_level_header")[0].innerText = "Niveau";
			$("#Logs_msg_header")[0].innerText = "Message";
			break;
			}
		case "en": {
			$("#Logs_Header_caption")[0].innerText = "Logs (ctrl+l)";
			
			$("#Logs_stamp_header")[0].innerText = "Date-Time";
			$("#Logs_level_header")[0].innerText = "level";
			$("#Logs_msg_header")[0].innerText = "Message";
			break;
			}
		}
	}
	
Logs.prototype.triggerResize = function() { 
	
	}	

/*
	*/
Logs.prototype.log = function( msg, level, stamp) { 

	let tbody = $("#Logs_table_body")[0];
	let row = undefined;
	
	row = tbody.insertRow( 0);
	row.classList.add( "myBorderUD");
	row.classList.add( "myInternalWidth");
	row.onclick = this.LogListManager.rowSelectionByClick;
	row.ondblclick = this.LogListManager.rowActionByDoubleClick;
	
	// Logs_stamp_header
	let cStamp = row.insertCell(0);
	cStamp.classList.add("myItemValue");
	cStamp.style["width"] = "200px";
	cStamp.style["text-align"] = "center";
	
	// Logs_level_header
	let cLevel = row.insertCell(1);
	cLevel.classList.add("myItemValue");
	cLevel.style["width"] = "60px";
	cLevel.style["text-align"] = "center";
	
	// Logs_msg_header
	let cMsg = row.insertCell(2);
	cMsg.classList.add("myItemValue");
	cMsg.style["width"] = "1500px";
	cMsg.style["text-align"] = "left";
	
	cStamp.innerText = stamp != undefined ? stamp.yyyymmddhhmmsslll() : new Date().yyyymmddhhmmsslll();
	
	cLevel.innerText = level != undefined ? _Lang.transSentence( level) : "";
	
	cMsg.innerText = _Lang.transSentence( msg);
	
	if (tbody.rows.length > this.maxLines) {
		tbody.deleteRow( tbody.rows.length-1);
		}
	}

Logs.prototype.clearLogs = function() {
	$("#Logs_table_body")[0].innerText = "";
	}