
var app = {// Application Constructor
    initialize: function () {// deviceready Event Handler
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
        document.addEventListener("backbutton", this.onBackKeyDown, false)
        document.addEventListener("pause", this.onPause, false)
        document.addEventListener("resume", this.onResume, false)
        document.addEventListener("menubutton", this.onMenu, false)
    },
    onDeviceReady: function () {
        //this.receivedEvent('deviceready')
        console.log('Device is Ready...')
        maininitalizer();
    },
    onBackKeyDown: function () {
        //console.warn('"Back button" event triggered')
        back_action()
    },
    onPause: function () {
        console.warn('"pause" event triggered')
        document.getElementById('main_intro').pause()
    },
    onResume: function () {
        console.warn('"Resume" event triggered')
        document.getElementById('main_intro').play()
    },
    onMenu: function () {
        console.warn('"Menu button" event triggered')
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id)
        var listeningElement = parentElement.querySelector('.listening')
        var receivedElement = parentElement.querySelector('.received')

        listeningElement.setAttribute('style', 'display:none;')
        receivedElement.setAttribute('style', 'display:block;')

        console.log('Received Event: ' + id)
    },
}; app.initialize()

function maininitalizer() {//Runs after 'Device ready'

    if (localStorage.getItem("APPname_cfg")) {
        config.load()
    } else {
        config.validate()
    }
    window.screen.orientation.lock('landscape');//lcock landscape
    statusbar.visible = false;
    StatusBar.hide()
    navigator.splashscreen.hide();
}

let config = {
    data: {//Loacal app data
        key: "APPname_cfg",
    },
    save: async function () {//Save the config file
        console.warn('Configuration is being saved')
        localStorage.setItem("APPname_cfg", JSON.stringify(config.data))
        console.table(config.data)
    },
    load: function () {//Load the config file
        console.warn('Configuration is being loaded')
        config.data = JSON.parse(localStorage.getItem("APPname_cfg"))
        console.table(config.data)
        this.validate()
    },
    validate: function () {//validate configuration file
        console.warn('Config is being validated')
        var configisvalid = true

        if (!configisvalid) {
            console.log('config was found to be invalid and will be overwritten')
            this.save()//Save new confog because old config is no longer valid
        } else { console.log('config was found to be valid') }
    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        localStorage.clear("APPname_cfg")
        console.log('config deleted: ')
        console.table(config.data)
        this.validate()
    }
}

let properties = {
    exit: false,
}

let utility = {//Some usefull things
    exit_strategy: function () {//Heres how to string things togther to make something usefull
        console.warn('Exit strategy triggered')
        if (properties.exit == true) {
            setTimeout(() => { utility.close() },300)
        } else {
            properties.exit = true;
            utility.toast("Press back button again to exit", 2000)
            setTimeout(() => { properties.exit = false }, 2000)
        }
    },
    /*  Close the app   */
    close: function () {
        console.trace('App closure triggered via')
        //config_handler.save()
        if (navigator.app) {
            navigator.app.exitApp()
        } else if (navigator.device) {
            navigator.device.exitApp()
        } else {
            window.close()
        }
    },
    get_url_variables: function (url) {
        //Yoinked from
        //https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
        //returns Object { "": "undefined" } if empty
        //Call with var this_url = getParams(window.location.href);
    },
    /*  Produce toast messages    */
    toast: async function (text, durration_in_ms, position_top_right_left_bottom, offset_in_px) {
        if (position_top_right_left_bottom == undefined) { position_top_right_left_bottom = 'bottom' }//default the position
        if (durration_in_ms == undefined) { durration_in_ms = 4000 }//default the duration
        if (offset_in_px == undefined) { offset_in_px = -160 }//default the offset
        window.plugins.toast.showWithOptions({ message: text, duration: durration_in_ms, position: position_top_right_left_bottom, addPixelsY: offset_in_px })
    },
    /*  Push text to the keyboard   */
    clipboard: async function (textpush) {
        copyText.toString()
        var temptxtbox = document.createElement("input")
        document.body.appendChild(temptxtbox)
        temptxtbox.setAttribute("id", "temp_copy")
        document.getElementById("temp_copy").value = copyText
        temptxtbox.select()
        document.execCommand("copy")
        document.body.removeChild(temptxtbox)
    },
    /*  Produce Random numbers  */
    rand: {
        HEX: function () { return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */ },
        RGB: function () { return { RED: this.number(255, 0), GREEN: this.number(255, 0), BLUE: this.number(255, 0) } /* object with RGB color code */ },
        HSL: function () { return { HUE: this.number(360, 0), SATURATION: this.number(100, 0) + '%', LIGHTENESS: this.number(100, 1) + '%' }/* HSL color code */ },
        number(max, min) { return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/ }
    },
}

function back_action() {
    utility.exit_strategy()
}

document.getElementById('title_exit').addEventListener('click', utility.close)