/// <reference path="../typings/tsd.d.ts" />

'use strict'
var fs = require('fs');

class Canvas {
    public id: string;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private borderWidth = 0; //set from css
    private painters: Painter[];
    private painter: Painter;
    private width: number;
    private height: number;
    constructor(id: string, painter: Painter) {
        this.id = id;

        var canvas = <HTMLCanvasElement>document.getElementById(id);
        if (!canvas || !canvas.getContext) return;
        var context = <CanvasRenderingContext2D>canvas.getContext("2d");

        this.painter = painter;
        this.canvas = canvas;
        this.context = context;
        this.setActions();
        this.width = parseInt($("#" + id).css("width"));
        this.height = parseInt($("#" + id).css("height"));

    }
    setActions(painter = this.painter) {
        ["mousedown", "mousemove", "mouseup", "mouseleave"].forEach(actionName=> {
            this.resetAction(actionName);
            this.setAction(actionName, painter);
        });
    }
    setAction(actionName: string, painter= this.painter) {
        $("#" + this.id).on(actionName, e => {
            if (painter.tool && painter.tool.actions[actionName]) {
                painter.tool.actions[actionName](e);
            }
        });
    }
    resetAction(actionName: string) {
        $("#" + this.id).on(actionName, e => { });
    }
    addPainter() {

    }
    position(e) {
        var x = e.pageX - $("#" + this.id).offset().left - this.borderWidth;
        var y = e.pageY - $("#" + this.id).offset().top - this.borderWidth;
        return [x, y];
    }

    drawPoint(x: number, y: number, width= 1, color= "#000000") {
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(x, y, width / 2, 0, Math.PI * 2, false);
        this.context.fill();
        
    }

    drawLine(x: number, y: number, xx: number, yy: number, width= 1, color= "#000000") {
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.lineWidth = width;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(xx, yy);
        this.context.stroke();
    }
    /**
     * ‰æ‘œ•\Ž¦
     */
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    showImage(x: number, y: number, image) {
        this.clear();
        this.context.drawImage(image, x, y);
    }

    dataUrl() {
        return this.canvas.toDataURL();
    }



}

class Painter {
    private startX: number;
    private startY: number;
    private x: number;
    private y: number;
    public tool: Tool;
    private actions: string[];
    private canvas: Canvas;
    private state: Object;
    resetActions() {
        for (var action in this.actions) {

        }
    }
    use(newTool: Tool) {
        this.resetActions();

        this.tool = newTool;
        /*
        for (var action in this.tool.actions) {
            console.log(action, this.tool.actions[action]);
        };
        */
    }
}

class Tool {
    public name: string;
    public actions: Object;
    constructor(name: string, actions: Object) {
        this.name = name;
        this.actions = actions;

    }
}

class Pen extends Tool {
    size: number;
    x: number;
    y: number;
    isDrawing: boolean;
}

class ToolButton {
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
$(() => {

    var painter = new Painter();
    var canvas = new Canvas("canvas__main", painter);
    //var cursorCanvas = new Canvas("canvas__cursor", painter);
    var pen = new Pen("pen", {
        mousedown: e=> {
            var pos = canvas.position(e);
            pen.x = pos[0];
            pen.y = pos[1];
            pen.isDrawing = true;
        },
        mousemove: e=> {
            if (!pen.isDrawing) return;
            var pos = canvas.position(e);
            canvas.drawLine(pen.x, pen.y, pos[0], pos[1]);
            pen.x = pos[0];
            pen.y = pos[1];
        },
        mouseup: e=> {
            pen.isDrawing = false;
        },
        mouseleave: e=> {
            pen.isDrawing = false;
        }
    });

    var eraser = new Pen("eraser", {
        mousedown: e=> {
            var pos = canvas.position(e);
            eraser.x = pos[0];
            eraser.y = pos[1];
            eraser.isDrawing = true;
            canvas.drawPoint(pos[0], pos[1], 5, "rgba(256, 256, 256, 1");
        },
        mousemove: e=> {
            if (!eraser.isDrawing) return;
            var pos = canvas.position(e);
            canvas.drawLine(eraser.x, eraser.y, pos[0], pos[1], 5, "rgba(256, 256, 256, 1");
            eraser.x = pos[0];
            eraser.y = pos[1];
        },
        mouseup: e=> {
            eraser.isDrawing = false;
        },
        mouseleave: e=> {
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
    $("#btn__clear").on("click", () => {
        canvas.clear();
    });
    $("#btn__save").on("click", () => {
        console.log("for save\n" + canvas.dataUrl());
        var url = canvas.dataUrl().substr(22);// FIXME DANGER
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