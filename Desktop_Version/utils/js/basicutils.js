let notify = {//notification function house
    reset: window.addEventListener('resize', () => { notify.clearall() }),
    inpage: function (title, body, hover_title, ifunction) {

        let notification = document.createElement("div")
        notification.classList = "notification"

        let notification_title = document.createElement("div")//title
        notification_title.classList = "title"
        notification_title.innerHTML = title

        let nbody = document.createElement("div")//body
        nbody.classList = "notifbody"
        nbody.innerHTML = body;

        if (hover_title != undefined) {
            notification.title = hover_title
        } else {
            notification.title = 'click to dismiss'
        }

        notification.appendChild(notification_title)
        notification.appendChild(nbody)
        document.body.appendChild(notification)

        if (typeof (ifunction) == 'function') { //imbedded function
            notification.addEventListener('click', ifunction);
            //Close button
            let xbutton = document.createElement('div')
            xbutton.setAttribute('class', 'x-button')
            notification.appendChild(xbutton)
            xbutton.title = 'click to dismiss';
            xbutton.addEventListener('click', function (e) { removethis(e, notification) })
        } else {
            notification.addEventListener('click', function (e) { removethis(e, notification) })
        }

        //Timing effects
        setTimeout(() => {
            notification.style.transform = 'translateX(0)'
            notify.shove()
        }, 50);

        setTimeout(() => { notification.style.opacity = '0.0' }, 10000); //dissapear

        setTimeout(() => { try { document.body.removeChild(notification) } catch (err) { console.warn(err) } }, 11000); //remove from document

        function removethis(e, rnotification) {
            e.stopImmediatePropagation();
            rnotification.style.transform = 'translateX(22rem)';
            setTimeout(() => { rnotification.style.opacity = '0.0'; }, 100)
            setTimeout(() => { try { document.body.removeChild(notification) } catch (err) { console.warn(err) } }, 1000)
        }

    },
    shove: function () {
        var notifications = document.querySelectorAll(".notification")
        var reverse = notifications.length - 1;
        for (let i in notifications) {
            notifications[i].style.transform = 'translateY(' + -reverse * 9 + 'rem)';//9 rem., height of notification
            reverse--;//get it, because oposite
        }
    },
    clearall: function () {
        document.querySelectorAll(".notification").forEach((notification) => {
            try {
                notification.style.opacity = '0.0';
                notification.style.transform = 'translate(0,0)'
            } catch (err) {
                console.warn(err)
            }
        })
    }
}

module.exports = {
    inpage_notification: async function (title, body, hover_title, ifunction) {
        notify.inpage(title, body, hover_title, ifunction)
    }
}