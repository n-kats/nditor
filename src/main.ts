/// <reference path="../typings/tsd.d.ts" />

var app = angular.module('nditor', []);
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

module nditor{
    export class EditorController{
        name: string;
        document: string;
        constructor(private $scope) {
            this.document = "";
            this.name = "nditor";
        }
        save() {
            /*
            exec('node -v', (err, stdout, stderr) => {
                if (!err) {
                    this.document = this.$scope.document + "\n" + stdout;
                } else {
                    console.log(err);
                }
            });*/
        }
    }
    app.controller('editorCtrl', EditorController);
}