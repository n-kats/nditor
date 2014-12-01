/// <reference path="../typings/tsd.d.ts" />
var app = angular.module('nditor', []);
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var nditor;
(function (nditor) {
    var EditorController = (function () {
        function EditorController($scope) {
            this.$scope = $scope;
            this.document = "";
            this.name = "nditor";
        }
        EditorController.prototype.save = function () {
            /*
            exec('node -v', (err, stdout, stderr) => {
                if (!err) {
                    this.document = this.$scope.document + "\n" + stdout;
                } else {
                    console.log(err);
                }
            });*/
        };
        return EditorController;
    })();
    nditor.EditorController = EditorController;
    app.controller('editorCtrl', EditorController);
})(nditor || (nditor = {}));
