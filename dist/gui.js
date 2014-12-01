/// <reference path="../typings/tsd.d.ts" />
var gui = require('nw.gui'), win = gui.Window.get(), menu = new gui.Menu();
menu.append(new gui.MenuItem({
    label: "menuItem01",
    click: function () {
        console.log("click menuItem!!");
    }
}));
menu.popup(20, 20);
