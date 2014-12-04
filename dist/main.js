/// <reference path="../typings/tsd.d.ts" />
var app = angular.module('nditor', []);
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var nditor;
(function (nditor) {
    var OutlineController = (function () {
        function OutlineController() {
            this.name = "nditor";
            this.main_size = 70;
            this.nav_size = 30;
        }
        return OutlineController;
    })();
    nditor.OutlineController = OutlineController;
    var EditorController = (function () {
        function EditorController($scope) {
            this.$scope = $scope;
            this.document = "";
            this.name = "nditor";
        }
        EditorController.prototype.save = function () {
            this.document = this.$scope.document;
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
    var FileController = (function () {
        function FileController() {
        }
        return FileController;
    })();
    nditor.FileController = FileController;
    var ReportController = (function () {
        function ReportController() {
        }
        return ReportController;
    })();
    nditor.ReportController = ReportController;
    var PdfController = (function () {
        function PdfController() {
        }
        return PdfController;
    })();
    nditor.PdfController = PdfController;
    var ArXivController = (function () {
        function ArXivController() {
            this.query = "query";
            this.papers = [];
            for (var i = 0; i < 30; i++) {
                this.papers.push(new ArXivPaper("title" + i, ["author1", "authors"], "|abstract", new Link()));
            }
            console.log(this.papers);
        }
        return ArXivController;
    })();
    nditor.ArXivController = ArXivController;
    app.controller('outlineCtrl', OutlineController);
    app.controller('editorCtrl', EditorController);
    app.controller('arxivCtrl', ArXivController);
})(nditor || (nditor = {}));
var ArXivPaper = (function () {
    function ArXivPaper(title, authors, abstract, pdf) {
        this.title = title;
        this.authors = authors;
        this.abstract = abstract;
        this.pdf = pdf;
    }
    return ArXivPaper;
})();
var Link = (function () {
    function Link() {
    }
    return Link;
})();
