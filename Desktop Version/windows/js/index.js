const main = require('electron').remote.require('./main');//acess export functions in main
const { dialog, Menu, MenuItem, systemPreferences, nativeTheme } = require('electron').remote;//Acess to electron dependencies
var fs = require('fs');//file system

const text_box_menu = new Menu.buildFromTemplate([
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'selectAll' },
    { role: 'seperator' },
    { role: 'undo' },
    { role: 'redo' },
])

window.addEventListener('load', function () {//window loads

    window_menu()
    maininitalizer()
})

function maininitalizer() {//Used to start re-startable app functions

}

function window_menu() {//window menu
    //build menu
    const menu_body = new Menu()
    menu_body.append(new MenuItem({ role: 'togglefullscreen' }))
    menu_body.append(new MenuItem({ type: 'separator' }))
    menu_body.append(new MenuItem({ label: 'Contact developer', click() { shell.openExternal('https://anthonym01.github.io/Portfolio/?contact=me') } }))
    menu_body.append(new MenuItem({ role: 'toggledevtools' }))
    menu_body.append(new MenuItem({ role: 'reload' }))

    //attach menu to window
    window.addEventListener('contextmenu', (event) => {//opens menu on auxilery click
        event.preventDefault()
        menu_body.popup({ window: require('electron').remote.getCurrentWindow() })//popup menu
    }, false)
}

function textboxmenu() {//text box menus
    //add events to text boxes
    textbox.addEventListener('contextmenu', (event) => popupmenu, false)

    //Popup the menu in this window
    function popupmenu(event) {
        event.preventDefault()
        event.stopPropagation()
        text_box_menu.popup({ window: require('electron').remote.getCurrentWindow() })
    }
}

document.getElementById('title_exit').addEventListener('click', () => { main.clossapp() })

window.addEventListener('keydown', function (e) {
    console.log(e.key)
})