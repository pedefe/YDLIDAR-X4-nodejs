/*	manageSettings.js
	*/

function manageSettings( me) {

	// local settings
	me.locSet = {};

	/* récupérer les settings
		*/
	me.getSettings = function() {
		if (me.locSet) {
			return me.locSet;
			}
		else {
			return undefined;
			}
		}

	/*
		restaurer les settings
		*/
	me.setSettings = function( settings) {
		me.locSet = settings;
		if (me.setSettingsEx) {
			me.setSettingsEx();
			}
		}
}