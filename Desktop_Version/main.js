const { app, BrowserWindow, Menu, screen, MenuItem, Tray, ipcMain, Notification } = require('electron');
const path = require('path');
const url = require('url');
const axios = require("axios");
//const { createPublicKey } = require('crypto');
const worker = require('./utils/js/worker.js');//offload annoying things
const remote_host = 'address';
const windowStateKeeper = require('electron-window-state');//https://www.npmjs.com/package/electron-window-state
const Store = require('electron-store');//Store objects (https://www.npmjs.com/package/electron-window-state)

const storeinator = new Store;//a new store

let mainWindow = null, tray = false;

let config = {
	alt_location: false,
}

app.on('ready', function () {//App ready to roll
	console.log('storage location ', app.getPath('userData'))
	if (storeinator.get('default')) {
		config = JSON.parse(storeinator.get('default'))
	} else {
		setstorage()
	}
	createmainWindow()
	create_tray()
	axios.default.post(remote_host + '/post/test', JSON.stringify(app)).finally(() => { console.log('Phoned home') })

	new Notification({ title: 'Anthonym', body: 'App start', icon: path.join(__dirname, '/build/icon.png') }).show();
	//notifitcation.show();
})

ipcMain.on('mainwindow_channel', (event, data) => {//Receive Song data from mainwindow and apply to tray
	console.log('mainwindow reports : ', data);
})

ipcMain.on('alt_storage_file', (event, filedata) => {//Alt storage file
	if (config.alt_location == false) {
		//no
	} else {
		worker.write_file(config.alt_location + "/APPnamecfg config.json", JSON.stringify(filedata))
	}
})

ipcMain.on('wirte_file', (event, fpath, filedata) => { worker.write_file(fpath, filedata) })


app.on('window-all-closed', () => {//all windows closed
	if (process.platform !== 'darwin' && tray == false) { app.quit() }
})

app.on('activate', () => {//for darwin
	if (BrowserWindow.getAllWindows().length === 0) {
		createmainWindow();
	} else {
		mainWindow.show();
	}
})

function createmainWindow() {//Creates the main render process
	app.allowRendererProcessReuse = true;//Allow render processes to be reused

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
		icon: path.join(__dirname, '/build/icons/icon.png'),//some linux window managers cant process due to bug
		title: 'Blach app',
		show: true,
		//titleBarStyle: 'hiddenInset',
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			nodeIntegrationInWorker: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: false
		},
		minWidth: 400,
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, '/windows/game.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindowState.manage(mainWindow);//give window to window manager plugin
}

function create_tray() {//Create tray
	tray = new Tray(path.join(__dirname, 'build/icon.png'))

	tray.addListener('double-click', check_main_window)//double click tray

	const contextMenu = Menu.buildFromTemplate([//build contect memu
		{ id: 'name', label: 'Blach app alpha', click() { check_main_window() } },
		{ type: 'separator' },//seperator
		{ role: 'Quit' },//quit app
	])
	tray.setToolTip('Blach app')
	tray.setContextMenu(contextMenu)
}

function check_main_window() {//Checks for main window and creates or shows it
	if (BrowserWindow.getAllWindows().length !== 0) {//if no windows
		mainWindow.show()
	} else {
		createmainWindow()
	}
}

function setstorage() { storeinator.set('default', JSON.stringify(config)) }

module.exports = {
	check_main_window: function () { check_main_window() },
	write_to_file: async function (filepath, buffer_data) { worker.write_file(filepath, buffer_data); },
	get: {
		alt_location: function () { return config.alt_location },
	},
	set: {
		alt_location: function (set) { config.alt_location = set; setstorage(); },
	}
}