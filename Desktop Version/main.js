const { app, BrowserWindow, Menu, dialog, screen } = require('electron');
const path = require('path');
const url = require('url');
const windowStateKeeper = require('electron-window-state');//preserves the window state
//const { createPublicKey } = require('crypto');

let mainWindow = null;//defines the window as an abject

app.on('ready', function () {//App ready to roll
	createmainWindow()
})

function createmainWindow() {//Creates the main render process
	app.allowRendererProcessReuse = true;//Allow render processes

	//window manager plugin stuff
	const { screenwidth, screenheight } = screen.getPrimaryDisplay().workAreaSize //gets screen size
	let mainWindowState = windowStateKeeper({
		defaultWidth: screenwidth,
		defaultHeight: screenheight
	})

	mainWindow = new BrowserWindow({//make main window
		x: mainWindowState.x,//x psoition
		y: mainWindowState.y,//y position
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#000000',
		frame: true,
		center: true,//center the window
		alwaysOnTop: false,
		icon: path.join(__dirname, '/assets/icons/icon.ico'),
		title: 'Save Our Species',
		fullscreen: true,
		fullscreenable: true,
		//titleBarStyle: 'hiddenInset',
		minWidth: 400,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		}
	})

	mainWindow.loadURL(url.format({//load html into main window
		pathname: path.join(__dirname, '/game.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindowState.manage(mainWindow);//give window to window manager plugin
	mainWindow.setMenu(new Menu())
}

app.on('window-all-closed', () => { app.quit() })

exports.clossapp = () => { app.quit() }//export quit app

exports.minimize = () => { mainWindow.minimize() }//minimize window

exports.setontop = () => { mainWindow.setAlwaysOnTop(true) }//always on top the window

exports.setnotontop = () => { mainWindow.setAlwaysOnTop(false) }//always on top'nt the window
