/*	ListManager.js
	gestion fine des déplacements et des actions sur une liste
	*/

/*
	selSetFunc, selGetFunc : fonction pour lire et écrire la dernière ligne sélectionnée
	*/
function ListManager( me, tableId, bodyId, /*selGetFunc, selSetFunc, */ selCallBackFunc, selActionCallBackFunc) {

	var self = this;
	self.farO = me;
	
	this.table = $("#" + bodyId)[0];
	this.bodyId = bodyId;
	this.currentClickedRow = null;
	this.previousClickedRow = null;
	/*this.selGetFunc = selGetFunc;
	this.selSetFunc = selSetFunc;*/
	this.selCallBackFunc = selCallBackFunc;
	this.selActionCallBackFunc = selActionCallBackFunc;

	// zone masquée qui recevra les events
	this.hiddenInputId = tableId + "_input";
	var content = "<input type='text' id='{0}' class='myInvisibleInput'>".format( this.hiddenInputId);
	$("#" + tableId)[0].insertAdjacentHTML( 'beforeend', content);

	$("#" + this.hiddenInputId)[0].ListManager = this;
	$("#" + bodyId)[0].ListManager = this;

	/* */
	$("#" + tableId).on( "click", function( event) {
		event.stopPropagation();
		event.preventDefault();
		self.focusOn();
		self.selectNewRow( event.target);
		});

	/* */
	$("#" + this.hiddenInputId).on( "keydown", function( e) {
		self.processKeyDown( e);
		});

	}

/*
	*/
ListManager.prototype.focusOn = function() {
	
	$("#" + this.hiddenInputId).focus();
	};

/*
	*/
ListManager.prototype.processKeyDown = function( event) {
	
	let self = event.currentTarget.ListManager;

	if (self.previousClickedRow == null) return;

	// let table = $("#" + tableId)[0];
	let clientHeight = self.table.clientHeight;
	let rowHeight = self.previousClickedRow.scrollHeight;
	let nbRows = Math.floor( clientHeight / rowHeight);

	let other = null;
	do {
		if (event.which == keyCode_downArrow) {
			event.preventDefault();
			other = getNextTableRow( self.previousClickedRow);
			break;
			}
		if (event.which == keyCode_Home) {
			event.preventDefault();
			other = getFirstTableRow( self.previousClickedRow);
			break;
			}
		if (event.which == keyCode_End) {
			event.preventDefault();
			other = getLastTableRow( self.previousClickedRow);
			break;
			}
		if (event.which == keyCode_upArrow) {
			event.preventDefault();
			other = getPreviousTableRow( self.previousClickedRow);
			break;
			}
		if (event.which == keyCode_pgDown) {
			event.preventDefault();
			other = getNextTableRow( self.previousClickedRow);
			if (other != null ) {
				for( let i=0; i < (nbRows/2) - 1; i++) other = getNextTableRow( other);
				if (other == null) other = getLastTableRow( self.previousClickedRow);
				}
			break;
			}
		if (event.which == keyCode_pgUp) {
			event.preventDefault();
			other = getPreviousTableRow( self.previousClickedRow);
			if (other != null ) {
				for( let i=0; i < (nbRows/2) - 1; i++) other = getPreviousTableRow( other);
				if (other == null) other = getFirstTableRow( self.previousClickedRow);
				}
			break;
			}

		if (event.which == keyCode_Space || event.which == keyCode_enter) {
			if (self.rowActionByDoubleClick) {
				self.rowActionByDoubleClick( self.previousClickedRow);
				}
			}		
		}
	while( false);

	if (other != null) {
		self.selectNewRow( other);
		other.scrollIntoViewIfNeeded();
		}		
	};

/*
	*/
ListManager.prototype.setRowVisible = function( row) {	
	if (row) row.scrollIntoViewIfNeeded();
	}

/*
	*/
ListManager.prototype.selectNewRow = function( target) {

	let self;
	if (target) {
		self = target.parentElement.ListManager;
		}
	else {
		self = this;
		}
	
	if (self) {

		let newSel = self.previousClickedRow;

		if (newSel != null) {
			newSel.classList.remove( 'myListSelected');
			newSel = null;
			}

		if (target) {
			if (isClass( target, 'myListSelected')) {
				target.classList.remove('myListSelected');
				}
			else {
				target.classList.add('myListSelected');
				self.previousClickedRow = target;
				}
			}
		self.currentClickedRow = target;
		
		if (self.selCallBackFunc) {
			self.selCallBackFunc( target);
			}
		}
	};

/*
	*/
ListManager.prototype.rowSelectionByClick = function( source) {
	
	let element = null;
	if (source.currentTarget) element = source.currentTarget;
	else element = source;
	
	let self = element.parentElement.ListManager;
	if (self != null) {
		self.selectNewRow( element);
		}
	};

/*
	*/
ListManager.prototype.rowActionByDoubleClick = function( source) {

	let element = null;
	if (source.currentTarget) element = source.currentTarget;
	else element = source;

	let self = element.parentElement.ListManager;
	self.selectNewRow( element);

	self.selActionCallBackFunc( element);
	};
	
/*
	*/
ListManager.prototype.focusOnList = function ( rowIdx) {

	let self = $("#" + this.hiddenInputId)[0].ListManager;

	self.focusOn();
	if (rowIdx != undefined) {
		let row = $("#" + self.bodyId)[0].rows[ rowIdx];
		if (row != undefined)
			self.rowSelectionByClick( row);
		}
	};

/*
	*/
ListManager.prototype.getSelectedRow = function () {
	let self = $("#" + this.hiddenInputId)[0].ListManager;
	return self.previousClickedRow;
	}
