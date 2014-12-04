/// <reference path="../typings/tsd.d.ts" />

var app = angular.module('nditor', []);
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

module nditor{
    export class OutlineController {
        name = "nditor";
        main_size = 70;
        nav_size = 30;
    }

    export class EditorController{
        name: string;
        document: string;
        constructor(private $scope) {
            this.document = "";
            this.name = "nditor";
        }
        save() {
            this.document = this.$scope.document;
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

    export class FileController { }
    export class ReportController { }
    export class PdfController { }
    export class ArXivController {
        query: any;
        papers: ArXivPaper[];
        constructor() {
            this.query = "query";
            this.papers = [];
            for (var i = 0; i < 30; i++) {
                this.papers.push(new ArXivPaper("title"+i, ["author1", "authors"], "|abstract", new Link()));
            }
            console.log(this.papers);
        }
    }

    app.controller('outlineCtrl', OutlineController);
    app.controller('editorCtrl', EditorController);
    app.controller('arxivCtrl', ArXivController);
}

class ArXivPaper {
    title: string;
    authors: any[];
    abstract: string;
    pdf: Link;
    constructor(title: string, authors: any[], abstract: string, pdf: Link) {
        this.title = title;
        this.authors = authors;
        this.abstract = abstract;
        this.pdf = pdf;
    }
}
class Link { }