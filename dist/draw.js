/// <reference path="../typings/tsd.d.ts" />
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require('fs');

var Canvas = (function () {
    function Canvas(id, painter) {
        this.borderWidth = 0;
        this.id = id;

        var canvas = document.getElementById(id);
        if (!canvas || !canvas.getContext)
            return;
        var context = canvas.getContext("2d");

        this.painter = painter;
        this.canvas = canvas;
        this.context = context;
        this.setActions();
        this.width = parseInt($("#" + id).css("width"));
        this.height = parseInt($("#" + id).css("height"));
    }
    Canvas.prototype.setActions = function (painter) {
        var _this = this;
        if (typeof painter === "undefined") { painter = this.painter; }
        ["mousedown", "mousemove", "mouseup", "mouseleave"].forEach(function (actionName) {
            _this.resetAction(actionName);
            _this.setAction(actionName, painter);
        });
    };
    Canvas.prototype.setAction = function (actionName, painter) {
        if (typeof painter === "undefined") { painter = this.painter; }
        $("#" + this.id).on(actionName, function (e) {
            if (painter.tool && painter.tool.actions[actionName]) {
                painter.tool.actions[actionName](e);
            }
        });
    };
    Canvas.prototype.resetAction = function (actionName) {
        $("#" + this.id).on(actionName, function (e) {
        });
    };
    Canvas.prototype.addPainter = function () {
    };
    Canvas.prototype.position = function (e) {
        var x = e.pageX - $("#" + this.id).offset().left - this.borderWidth;
        var y = e.pageY - $("#" + this.id).offset().top - this.borderWidth;
        return [x, y];
    };

    Canvas.prototype.drawPoint = function (x, y, width, color) {
        if (typeof width === "undefined") { width = 1; }
        if (typeof color === "undefined") { color = "#000000"; }
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(x, y, width / 2, 0, Math.PI * 2, false);
        this.context.fill();
    };

    Canvas.prototype.drawLine = function (x, y, xx, yy, width, color) {
        if (typeof width === "undefined") { width = 1; }
        if (typeof color === "undefined") { color = "#000000"; }
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.lineWidth = width;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(xx, yy);
        this.context.stroke();
    };

    /**
    * �摜�\��
    */
    Canvas.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    Canvas.prototype.showImage = function (x, y, image) {
        this.clear();
        this.context.drawImage(image, x, y);
    };

    Canvas.prototype.dataUrl = function () {
        return this.canvas.toDataURL();
    };
    return Canvas;
})();

var Painter = (function () {
    function Painter() {
    }
    Painter.prototype.resetActions = function () {
        for (var action in this.actions) {
        }
    };
    Painter.prototype.use = function (newTool) {
        this.resetActions();

        this.tool = newTool;
        /*
        for (var action in this.tool.actions) {
        console.log(action, this.tool.actions[action]);
        };
        */
    };
    return Painter;
})();

var Tool = (function () {
    function Tool(name, actions) {
        this.name = name;
        this.actions = actions;
    }
    return Tool;
})();

var Pen = (function (_super) {
    __extends(Pen, _super);
    function Pen() {
        _super.apply(this, arguments);
    }
    return Pen;
})(Tool);

var ToolButton = (function () {
    function ToolButton(id, tool, painter) {
        var _this = this;
        this.id = id;
        this.tool = tool;
        this.painter = painter;
        $("#" + id).on("click", function () {
            _this.painter.use(_this.tool);
        });
    }
    return ToolButton;
})();

/*
class ConfigButton {
id: string;
tool: Tool;
painter: Painter;
constructor(id: string, tool: Tool, painter: Painter) {
this.id = id;
this.tool = tool;
this.painter = painter;
$("#" + id).on("click", () => {
this.painter.use(this.tool);
});
}
}
*/
$(function () {
    var painter = new Painter();
    var canvas = new Canvas("canvas__main", painter);

    //var cursorCanvas = new Canvas("canvas__cursor", painter);
    var pen = new Pen("pen", {
        mousedown: function (e) {
            var pos = canvas.position(e);
            pen.x = pos[0];
            pen.y = pos[1];
            pen.isDrawing = true;
        },
        mousemove: function (e) {
            if (!pen.isDrawing)
                return;
            var pos = canvas.position(e);
            canvas.drawLine(pen.x, pen.y, pos[0], pos[1]);
            pen.x = pos[0];
            pen.y = pos[1];
        },
        mouseup: function (e) {
            pen.isDrawing = false;
        },
        mouseleave: function (e) {
            pen.isDrawing = false;
        }
    });

    var eraser = new Pen("eraser", {
        mousedown: function (e) {
            var pos = canvas.position(e);
            eraser.x = pos[0];
            eraser.y = pos[1];
            eraser.isDrawing = true;
            canvas.drawPoint(pos[0], pos[1], 5, "rgba(256, 256, 256, 1");
        },
        mousemove: function (e) {
            if (!eraser.isDrawing)
                return;
            var pos = canvas.position(e);
            canvas.drawLine(eraser.x, eraser.y, pos[0], pos[1], 5, "rgba(256, 256, 256, 1");
            eraser.x = pos[0];
            eraser.y = pos[1];
        },
        mouseup: function (e) {
            eraser.isDrawing = false;
        },
        mouseleave: function (e) {
            eraser.isDrawing = false;
        }
    });

    /*
    var stamp = new Tool("stamp", {
    mousemove: e=> {
    var pos = cursorCanvas.position(e);
    cursorCanvas.showImage(pos[0], pos[1], $("#stamp")[0]);
    },
    mouseleave: e=> {
    cursorCanvas.clear();
    }
    });
    */
    new ToolButton("btn__pen", pen, painter);
    new ToolButton("btn__eraser", eraser, painter);
    $("#btn__clear").on("click", function () {
        canvas.clear();
    });
    $("#btn__save").on("click", function () {
        console.log("for save\n" + canvas.dataUrl());
        var url = canvas.dataUrl().substr(22);
        console.log(url);
        var buffer = new Buffer(url, "base64");
        fs.writeFile("./tmp/data.png", buffer);
        console.log("./tmp/data.png");
    });

    painter.use(pen);
});
/*
class CanvasControl {
}
function setupCanvas(id: string, ctrl: CanvasControl) {
$(id).on("mousedown",() => {
console.log("click");
});
}
$(document).ready(() => {
var ctrl = new CanvasControl();
setupCanvas("#main", ctrl);
});
*/
