/*
		GridManager.js
		FPI
		¤ gestionnaire de grille pour aligner les objets dedans
		*/
		
/*	Inclut la grid dans un parent;
			parentId
			bkColor : couleur de fond éventuelle
			defCols, defRows nombre de colonne et de ligne
			
		On déplace les objects sur la grid, et si la touche control est active, l'objet est 'calé' sur la grille.
		
		Penser à 
		
		- implementer 
			function onAppShowChange(e) {
				e.gridManager.clearWin( e.gridManager, e.divWin);
				}
				
		- dans dragWindow, transmettre le GridManager;
		- dans makeResizableDiv, transmettre le GridManager;
	*/

// catalogue des gM
var _gridManagers = {};

function GridManager( parentId, gridMgId, bkColor, defCols, defRows, debug) {
	
	let gM = this;
	// catalogue
	_gridManagers[ gridMgId] = gM;

	this.debug = debug == true ? true : false;
	this.id = gridMgId;
	this.parent = $("#" + parentId)[0];
	if (bkColor) this.parent.style["background-color"] = bkColor;
	this.parent.classList.add('myInternalWholePage');
	
	this.div = document.createElement("div");
	this.div.id = gridMgId;
	this.div.gridManager = this;
	this.div.classList.add('myInternalWholePage');
	this.parent.appendChild( this.div);
	if (gM.debug) this.div.style["background-color"] = "yellow";
	
	this.table = document.createElement("table");
	// this.table.classList.add('myBorderAround');
	// this.table.classList.add('myTableCollapse');	==> pour avoir une petite marge entre chaque cellule;
	// this.table.classList.add('myBlock'); => limite le tableau au contenu;
	this.table.classList.add('myInternal');
	this.table.style["table-layout"] = "fixed"; // auto
	this.div.appendChild( this.table);
	
	for( let r=0; r < defRows; r++) {
		let row = this.table.insertRow(r);
		row.classList.add( 'myInternal');
		// row.style.height = Math.floor( 100/ defRows) + "%";
		row.style.height = 100/ defRows + "%";
		
		for( let c=0; c < defCols; c++) {
			let cell = row.insertCell( c);
			cell.myRowIndex = r;
			
			if (gM.debug) cell.classList.add( 'myCellBorderAll');
			else cell.classList.add( 'myCellBorderGridManager');
			// cell.style.height = Math.floor( 100/ defCols) + "%";
			// cell.style.height = 100/ defCols + "%";
			let avant = cell.scrollHeight;
			cell.style.height = 100/ defRows + "%";
			let apres = cell.scrollHeight;
			if (bkColor) cell.style["background-color"] = bkColor;
			cell.myWinElement = undefined;;
	
			// catch resize
			$(cell).resize( function() {
				let elems = $(this);
				let w = elems.width();
				let h = elems.height();
				for( e=0; e < elems.length; e++) {
					let elem = elems[ e];
					if (elem.myRowIndex == undefined) continue;
					gM.updatePositionAndSize( gM, elem.myRowIndex, elem.cellIndex, w, h);
					// console.log( "row: " + elem.myRowIndex + ", cell: " + elem.cellIndex + ", resize: width: " + w + ', height: ' + h );
					}
				});
			}
		}
	}

/* si l'élément disparait (masqué, supprimé)
	*/
GridManager.prototype.clearWin = function( gM, winElement) {
	if (winElement == undefined) return;
	let table = gM.table;
	let info = winElement.gridManagerInfo;	// { r: rBase, c: cBase, w: winMaxCol, h: winMaxRow, interCellX, interCellY }
	if (info == undefined) return;
	for( let r=info.r; r < info.r + info.h; r++) {
		let row = table.rows[r];
		for( let c=info.c; c < info.c + info.w; c++) {
			if (row.cells[c].myWinElement === winElement) {
				row.cells[c].myWinElement = undefined;				
				if (gM.debug) row.cells[c].innerText = "-";
				}
			}
		}
	winElement.gridManagerInfo = undefined;
	}
	
/* Mise à jour d'un objet dans la grille
	*/
GridManager.prototype.updatePositionAndSize = function( gM, row, col, newW, newH) {
	let cell = gM.table.rows[ row].cells[ col];
	if (cell.myWinElement) {
		let info = cell.myWinElement.gridManagerInfo;	// { r: rBase, c: cBase, w: winMaxCol, h: winMaxRow, interCellX, interCellY }
		if (info == undefined){
			console.log("GridManager.prototype.updatePositionAndSize > bug on " + cell.myWinElement.id);
			}
		if (info.r && info.r == row && info.c && info.c == col) {
			cell.myWinElement.style.left = cell.offsetLeft + "px";
			cell.myWinElement.style.top = cell.offsetTop + "px";
			
			/*cell.myWinElement.style.width = newW * info.w + (info.w-1) * (info.interCellX * 2) + "px";
			cell.myWinElement.style.height = newH * info.h + (info.h-1) * (info.interCellY * 2) + "px";*/
			cell.myWinElement.style.width = cell.clientWidth * info.w + (info.w-1) * (info.interCellX * 2) + "px";
			cell.myWinElement.style.height = cell.clientHeight * info.h + (info.h-1) * (info.interCellY * 2) + "px";
			if (cell.myWinElement.farO.triggerResize) cell.myWinElement.farO.triggerResize();
			}
		}
	}
	
/* recherche l'espace libre pour les requis de l'objet
	*/
GridManager.prototype.getFreeSpace = function( gM, winElement,rBase, cBase, maxR, maxC) {

	let rCols = {};
	let table = gM.table;
	for( let r = rBase; r < Math.min( table.rows.length, rBase + maxR); r++) {
		let row = table.rows[r];
		rCols[ r] = [];
		for( let c=cBase; c < Math.min( table.rows[r].cells.length, cBase + maxC); c++) {
			let cell = row.cells[c];
			if (cell.myWinElement == undefined || cell.myWinElement.id == winElement.id) rCols[ r].push( c);
			else break;
			}
		if (rCols[ r].length == 0) {
			delete rCols[ r];
			break;
			}
		}
	let maxCols = 1000;
	$.each( rCols, function( key, value ) {			
		if (value.length < maxCols) maxCols = value.length;
		});
	
	let nbRow = Object.keys(rCols).length;
	let size = { r: nbRow, c: maxCols };
	return size;
	}

/* met à jour les indicateurs des cases réservées
	*/
GridManager.prototype.updateFilling = function( gM, cBase, rBase, winMaxCol, winMaxRow, winElement, erase, interCellX, interCellY) {
	
	let table = gM.table;
	for( let r=rBase; r < rBase + winMaxRow; r++) {
		let row = table.rows[r];
		if (row == undefined) {
			console.log( "GridManager.updateFilling > " + winElement.id + " > sans doute un changement de granulaité de grille (1)")
			return;	
			}
		for( let c=cBase; c < cBase + winMaxCol; c++) {
			if (row.cells[c] == undefined) {
				console.log( "GridManager.updateFilling > " + winElement.id + " > sans doute un changement de granulaité de grille (2)")
				return;	
				}
			row.cells[c].myWinElement = winElement;
			if (erase == false || erase == undefined) {
				row.cells[c].myWinElement = winElement;
				winElement.gridManagerInfo = { r: rBase, c: cBase, w: winMaxCol, h: winMaxRow, interCellX: interCellX, interCellY: interCellY };
				if (gM.debug) row.cells[c].innerText = winElement.id;
				}
			else {
				if (winElement) winElement.gridManagerInfo = undefined;
				row.cells[c].myWinElement = winElement;
				if (gM.debug) row.cells[c].innerText = "-";
				}
			}
		}
	}

/* Ne gère le layout que si ctrlKey==true
		mais si ctrlKey==false, on libère les cellules
	*/
GridManager.prototype.onMouseUpCB = function( winElement, ctrlKey, resize) {


	let gM = winElement.farO.gridManager;

	if (ctrlKey == false) {
		gM.clearWin( gM, winElement);
		return;
		}

	let xWin = window.getComputedStyle( winElement)["left"].replaceAll('px','');
	let yWin = window.getComputedStyle( winElement)["top"].replaceAll('px','');
	let wWin = window.getComputedStyle( winElement)["width"].replaceAll('px','');
	let hWin = window.getComputedStyle( winElement)["height"].replaceAll('px','');
				
	let table = gM.table;
	let placeFound = false;

	let interCellX = undefined;
	let interCellY = undefined;
	
	
	for( let r=0; r < table.rows.length; r++) {
		let row = table.rows[r];
		
		for( let c=0; c < table.rows[r].cells.length; c++) {
			let cell = row.cells[c];
			
			if (interCellX == undefined) interCellX = cell.offsetLeft;
			if (interCellY == undefined) interCellY = cell.offsetTop;
			
			let xCell = cell.offsetLeft;
			let yCell = cell.offsetTop;
			
			let wCell = cell.clientWidth;
			let hCell = cell.clientHeight;
			if ( xWin >= xCell && xWin < (xCell + wCell)
				&& yWin >= yCell && yWin < (yCell + hCell)
				&& (cell.myWinElement == null || cell.myWinElement.id == winElement.id) ) {

				// nombre de cellules auquel on peut prétendre en w et h
				let fullWidthCells;
				if (resize) fullWidthCells = Math.ceil( wWin / wCell);
				else fullWidthCells = Math.floor( wWin / wCell);
				if (fullWidthCells == 0) fullWidthCells = 1;
				
				let fullWidthRows;
				if (resize) fullWidthRows = Math.ceil( hWin / hCell);
				else fullWidthRows = Math.floor( hWin / hCell);
				if (fullWidthRows == 0) fullWidthRows = 1;
				
				// trouver le nombre de cellule libres en X et Y
				let size = gM.getFreeSpace( gM, winElement, r, c, fullWidthRows, fullWidthCells);
				let winMaxCol = Math.min( fullWidthCells, size.c) ;
				let winMaxRow = Math.min( fullWidthRows, size.r);
				
				// changement de place
				if (ctrlKey) {
					if (gM.debug) winElement.style["opacity"] = "0.5";
					winElement.style.left = xCell + "px";
					winElement.style.top = yCell + "px";
					winElement.style.width = (wCell * winMaxCol) + (winMaxCol-1) * (interCellX * 2) + "px";
					winElement.style.height = (hCell * winMaxRow) + (winMaxRow-1) * (interCellY * 2)  + "px";
					if (winElement.farO.triggerResize) winElement.farO.triggerResize();
					}
				
				// clear previous occupied cells
				if (winElement.gridManagerInfo != undefined) {
					gM.updateFilling( gM, winElement.gridManagerInfo.c, winElement.gridManagerInfo.r, 
						winElement.gridManagerInfo.w, winElement.gridManagerInfo.h, 
						winElement, true);
					}
					
				if (ctrlKey) {
					// declare new occupation
					gM.updateFilling( gM, c, r, winMaxCol, winMaxRow, winElement, false, interCellX, interCellY);
					}
				else {
					if (gM.debug) winElement.style["opacity"] = "1";
					}
				
				placeFound = true;
				break;
				//!!!!!
				}
			
			}
		if (placeFound) break;
		}
	}
	
/*	fin de redimensionnemnt
	*/
GridManager.prototype.stopResize = function( element, ctrlKey) {
	let gM = element.farO.gridManager;
	gM.onMouseUpCB( element, ctrlKey, true);
	}

/*	retourne les infos de positionnement contruites par le gridManager
	*/
GridManager.prototype.getInfo = function( winElement) {
	if (winElement == undefined) return;
	let info = winElement.gridManagerInfo;	// { r: rBase, c: cBase, w: winMaxCol, h: winMaxRow, interCellX, interCellY }
	if (info) {
		let a = 1;
		}
	else {
		let b = 2;
		}
	return info;
	}
	
/*
	*/
GridManager.prototype.getIntercell = function() {

	let gM = this;
	let table = gM.table;
	return { interCellX: interCellX = table.rows[0].cells[0].offsetLeft, interCellY: table.rows[0].cells[0].offsetTop };
	}
	
/* positionne un élément dans le gridManager sur la base des informations précédents
	*/
GridManager.prototype.restoreWinPosition = function( winElement, info) {

	let gM = this;
	let table = gM.table;
	let interCell = gM.getIntercell();
	
	if (table.rows[ info.r] == undefined
		|| table.rows[ info.r].cells[ info.c] == undefined) {
		console.log( "GridManager.restoreWinPosition > " + winElement.id + " > sans doute un changement de granulaité de grille")
		return;	
		}

	let cell = table.rows[ info.r].cells[ info.c];
	let xCell = cell.offsetLeft;
	let yCell = cell.offsetTop;
	let wCell = cell.clientWidth;
	let hCell = cell.clientHeight;
	winElement.style.left = xCell + "px";
	winElement.style.top = yCell + "px";
	winElement.style.width = (wCell * info.w) + (info.w-1) * (interCell.interCellX * 2) + "px";
	winElement.style.height = (hCell * info.h) + (info.h-1) * (interCell.interCellY * 2)  + "px";

	if (winElement.gridManagerInfo != undefined) {
		gM.updateFilling( gM, winElement.gridManagerInfo.c, winElement.gridManagerInfo.r, 
				winElement.gridManagerInfo.w, winElement.gridManagerInfo.h, 
				winElement, true);
		}
					
	// declare new occupation
	gM.updateFilling( gM, info.c, info.r, info.w, info.h, winElement, false, interCell.interCellX, interCell.interCellY);
	if (gM.debug) winElement.style["opacity"] = "0.5";

	if (winElement.farO.triggerResize) winElement.farO.triggerResize();
	}

/* end of file */
