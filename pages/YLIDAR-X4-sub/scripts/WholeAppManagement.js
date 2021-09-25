/*	WholeAppManagement.js
	*/
	
const _hostAddress = window.location.hostname;
const _hostPort = window.location.port;
var _ressourcePath = "./AutoMove-sub";

var _WSCon = null;

var _gridManager;
var _Lang;
var _Logs;
var _HttpInterface;
var _AppTools;		

var _apps = [];
var _currentUser = { objectId: "admin", objectType: 'User', settings: { userName: "admin" } };


/*
	*/
function WholeAppManagement_Init(
	ressourcePath) {
	
	_ressourcePath = ressourcePath;
	
	jconfirm.pluginDefaults.useBootstrap = false;

	// actions generiques sur la page
	preparePage();

	}
	
/*
	*/
function WholeAppManagement_DocumentReady() {
	
	_gridManager = new GridManager( 'wholePage', 'gridMg1', undefined, 10, 10, false);

	_Lang = new Lang( langCallBack);

	_HttpInterface = new HttpInterface( _hostAddress, _hostPort);
	
	_Logs = new Logs( _ressourcePath, $("#wholePage")[0], "idLogs", "gridMg1");
	declareModule( _Logs);

	_AppTools = new AppTools( _ressourcePath, $("#wholePage")[0], "idAppTools", "gridMg1", appToolsCallback);
	declareModule( _AppTools);
	}

/*
	*/
function WholeAppManagement_WindowLoad() {
	
	resetAppPositions();
			
	requestWebAppParameters();
	}

/*
	*/
function WholeAppManagement_WindowReady() {
	
	}
		
$(document).keydown(function(e){
	/*if (e.keyCode==90 && e.ctrlKey) {	// Ctrl+Z
		let obj = getAppFromName( "AppTools");			
		if (obj.show) obj.show( true);
		setWinOnTop( obj.divWin);
		}*/
	});

/* Set the width of the side navigation to 250px */
function openMainMenu() {
	document.getElementById("mainMenu").style.width = "250px";
	document.getElementById("wholePage").style.marginLeft = "250px";
	}

/* Set the width of the side navigation to 0 */
function closeMainMenu() {
	document.getElementById("mainMenu").style.width = "0";
	document.getElementById("wholePage").style.marginLeft = "0";
	}

/*
	*/
function onAppShowChange( app, visible) {
	do {
		// console.debug( 'app ' + app.divWin.id + ' switch to ' + visible);
		if (app
			&& visible == false
			&& app.gridManager) {
			app.gridManager.clearWin( app.gridManager, app.divWin);
			break;
			}

		// si l'application requiert une fonction de raffraîchissement avant affichage...
		if (app
			&& visible == true
			&& app.refreshAll) {
			app.refreshAll();
			}
		}
	while( false);
	}
		
/* click sur le fond de page
	*/
$("#wholePage").click( function(e) {
	closeMainMenu();
	});
	
$(document.body).click( function(e) {
	closeMainMenu();
	});

/*
	*/
function restoreSplashScreen() {
	$("#splashBadUser")[0].style.visibility = "visible";
	$("#splashBadUser")[0].style['z-index'] = 9999;
	$("#splashBadUser")[0].style['cursor'] = "not-allowed";
	}

/*
	*/
$("#splashCaption").click( function( event){
	window.location = "/AutoMove.html";
	});
			
/*
	*/
function requestWebAppParameters() {
	appToolsCallback( { event: 'parameters.positions.load' } );
	}
			
/*
	*/
function isAppOperating( app) {
	return ( app && (! app.isClosed()) );
	}
			
/*	Demande de sauvegarde des paramètres de position et de taille.
	*/
function appToolsCallback( msg) {
	do {
		// sauvegarde des positions
		if (msg.event == 'parameters.positions.save') {
			let jsn = [];
			_apps.forEach( function( app) {
				if (app != undefined) {
					let style = window.getComputedStyle( app.divWin);
					jsn.push( { 
						name: app.constructor.name, 
						position : { x: style.left, y: style.top }, 
						dimension: { w: style.width, h: style.height},
						hidden: app.isClosed(),
						gridManagerInfo: _gridManager.getInfo( app.divWin),
						settings: app.getSettings()
						} );
					}
				});
			let userConfigFileName = './pages/WebAppParameters.{0}.jsn'.format( _currentUser.objectId);
			_HttpInterface.sendHttpPostJson( '/WebAppParameters/set?fileName=' + userConfigFileName, jsn, 'WebApp parameter saving', undefined);
			break;
			}
			
		// recharge des position
		if (msg.event == 'parameters.positions.load') {
			let userConfigFileName = '/pages/WebAppParameters.{0}.jsn'.format( _currentUser.objectId);
			let request = userConfigFileName;
			_HttpInterface.sendHttpGetFile( request, 'Web App Parameters', processLoadedParameters, undefined);
			// !!! ANSWER processed in processLoadedParameters
			break;
			}
		
		if (msg.event == 'parameters.positions.reset') {
			resetAppPositions();
			break;
			}
		}
	while(false);
	}
			
/*
	*/
var _appNames = {};
function declareModule( app) {
	do {
		if (app == null || app == undefined) {
			throw "declareModule invalid app !";
			}
			
		if ( ! app.collId) {
			if (_appNames[ app.constructor.name] != undefined) {
				throw "declareModule : app " + app.constructor.name + " already exist !";
				}
			}
			
		if (_apps) _apps.push( app);
		
		if (app.collId) {
			_appNames[ app.collId] = app;
			}
		else {
			_appNames[ app.constructor.name] = app;
			}
		} 
	while( false);
	}
			
/*
	*/
function getAppFromName( name) {
	let obj = _appNames[ name];
	return obj;
	}

/* analyse des données, après la demande de chargement des paramètres de position et de taille.
	_lastAppPosParameters est un tableau des paramètres pour chaque application
	*/
var _lastAppPosParameters = [];

function processLoadedParameters( fileDescription, report) {
	do {
		let jsnReport = {};
		try {
			jsnReport = JSON.parse( report);
			}
		catch( err) {};
		
		let appPosParams = jsnReport;
		// appPosParams est un tableau des paramètres pour chaque application
		try {
			appPosParams.forEach( function( appParams) {
				let app = getAppFromName( appParams.name);
				if (app != undefined) {
					
					if (appParams.gridManagerInfo) {
						if (appParams.hidden == false)
							_gridManager.restoreWinPosition( app.divWin,  appParams.gridManagerInfo);
						}
					else {
						app.move( appParams.position.x, appParams.position.y);
						app.size( appParams.dimension.w, appParams.dimension.h);
						}

					if (app.show) {
						if (appParams.hidden) app.show( false);
						else app.show( true);
						}

					app.setSettings( appParams.settings);
					}
				});
			_lastAppPosParameters = appPosParams;
			}
		catch(err) {
			_Logs.log( "Paramètres non encore définis pour cette utilisateur. Faites une sauvegarde");
			}
		}
	while(false);
	}
			
/*
	*/
function updateAppPosition( name, obj) {
	let found = undefined;
	for( let index=0; index < _lastAppPosParameters.length; index++) {
		app = _lastAppPosParameters[index];
		if (app.name == name ) {
			if (obj != undefined) {
				obj.move( app.position.x, app.position.y);
				obj.size( app.dimension.w, app.dimension.h);
				found = obj;
				break;
				}
			}
		}
	if (found == undefined) {
		let winSize =  getElemDimension( document.body);
		let appSize =  getElemDimension( obj.divWin);
		
		obj.move( (winSize.w -appSize.w)  /2 + "px", (winSize.h -appSize.h)  /2 + "px");
		}
	}
			
/* reaffecte des positions iteratives
	*/
function resetAppPositions() {
	let posY = 0;
	let posX = 0;
	let stepPos = 35;
	
	_apps.forEach( function( app) {
		app.move( posX + "px", posY + "px");
		posY += stepPos;  posX += stepPos; 
		});
	let winWidth =  getElemDimension( document.body).w;
	let appWidth =  getElemDimension( _AppTools.divWin).w;
	let winHeight =  getElemDimension( document.body).h;
	let appHeight =  getElemDimension( _AppTools.divWin).h;
	_AppTools.move( (winWidth - appWidth)/2 + "px", (winHeight - appHeight)/2 + "px");
	}
			
/* demande de retraduction de tous les modules
	*/
function langCallBack( event) {
	// sur tous les menus
	pageTranslate();
	// sur tous les modules
	_apps.forEach( function( app) {
		app.translate();
		});
	}
			
/*
	*/
function pageTranslate() {
	if (_Lang._lang == "en") {
		}
	}
			
/*
	*/
function openMainMenuOption(me) {
	let name = me.name;
	let obj = getAppFromName( name);
	
	if (obj.show) obj.show( true);
	setWinOnTop( obj.divWin);
	closeMainMenu();
	}
	
/*
	*/
function saveViewsPositions(me) {
	appToolsCallback( { event: "parameters.positions.save" } );
	closeMainMenu();
	}
	
/*
	*/
function log( t) {
	console.log( t);
	}
