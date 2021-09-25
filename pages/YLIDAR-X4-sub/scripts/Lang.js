/* Lang.js
	*/
	
function Lang(
	callBack) {
	
	this._lang = "fr";
	this.callBack = callBack;
	}

/*
	*/
Lang.prototype.switchLanguage = function( sNewLang) {
	
	this._lang = sNewLang;
	this.translateAll();
	this.callBack( { newLang: this._lang } );
	}
	
/*
	*/
Lang.prototype.translateAll = function() {
	if (this._lang == "en") this.translateAll_en();
	else location.reload();
	}
	
/*
	*/
Lang.prototype.translateAll_en = function() {
	this.transInnerText( "id001", "NexoManager-Welcome");
	}
	
/*
	*/
Lang.prototype.transInnerText = function( sId, newText) {
	let elem = document.getElementById( sId);
	if (elem == null) return;
	elem.innerText = newText;
	}
	
/*
	*/
Lang.prototype.transValue = function( sId, newText) {
	let elem = document.getElementById( sId);
	if (elem == null) return;
	elem.value = newText;
	}
	
/*
	*/
Lang.prototype.transPlaceholder = function( sId, newText) {
	let elem = document.getElementById( sId);
	if (elem == null) return;
	elem.placeholder = newText;
	}
	
/*
	*/
Lang.prototype.transSentence = function( oldText) {
	let newText = oldText;
	switch( this._lang) {
		case "en": {
			switch( oldText) {
				case "oui": newText = "yes"; break;
				case "non": newText = "no"; break;
				case "Reçoit": newText = "Receive"; break;
				case "Génère": newText = "Send"; break;
				case "manuel": newText = "manual"; break;
				case "défaut de sécurité": newText = "security failure"; break;
				case "StationID : valeur numérique entre 0 et 4294967295": newText = "StationID : numeric value in [0..4294967295]"; break;
				case "latitude : valeur décimales entre -89.9 et +89.9": newText = "latitude : decimal value [-89.9 .. +89.9]"; break;
				case "longitude : valeur décimales entre -179.9 et +179.9": newText = "longitude : decimal value [-179.9 .. +179.9]"; break;
				case "interrogation...": newText = "request..."; break;
				case "Mise à jour effectuée.": newText = "Update processed."; break;
				case "Mise à jour effectuée. Redémarrez le Middleware.": newText = "Update processed. restart MiddleWare"; break;
				case "Mise à jour effectuée. Redémarrez l'UBR.": newText = "Update processed. restart RSU"; break;
				case "reboot émis. attendez.": newText = "reboot sent. Wait."; break;
				case "halt émis. Attendre 10 sec.": newText = "halt sent. Wait 10 sec.."; break;
				case "Redémmarage émis.": newText = "Restart sent."; break;
				case "Ecriture de l'horloge demandée.": newText = "Write of hwclock requested."; break;
				case "R+W demandé.": newText = "R+W requested."; break;
				case "Status SPaT demandé.": newText = "SPaT Status requested."; break;
				case "Arrêt SPaT demandé.": newText = "SPaT Stop requested."; break;
				case "Démarrage SPaT demandé.": newText = "SPaT Start requested."; break;
				}
			break;
			}
		}
	return newText;
	}