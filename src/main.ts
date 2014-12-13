/// <reference path="../typings/tsd.d.ts" />

var app = angular.module('nditor', []),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    xml2js = require('xml2js'),
    http = require('http');

module nditor{
    export class OutlineController {
        name = "nditor";
        main_size = 70;
        nav_size = 30;
        main_tab = "";
        sidenav_state = "";
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
        static api_url = 'http://export.arxiv.org/api/query';
        query: any;
        papers: ArXivPaper[];
        constructor() {
            this.query = '?search_query=all:math.GT & start = 0 & max_results = 25';
            this.papers = [];
            this.load();
        }
        load() {
            var url = ArXivController.api_url + this.query;
            http.get(url, (res) => {
                var body = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    xml2js.parseString(body, {
                        trim: true,
                        explicitArray: false
                    }, (err, data) => {
                        for (var i = 0; i < data.feed.entry.length; i++) {
                            var entry = data.feed.entry[i];
                            var paper = new ArXivPaper(entry.title, entry.author, entry.summary, new Link());//.to_json();
                            this.papers.push(paper);
                        }
                    });
                });
            });
        }
        showup() {
            $('.collapsible').collapsible();
        }
    }
    
    app.controller('outlineCtrl', OutlineController);
    app.controller('editorCtrl', EditorController);
    app.controller('arxivCtrl', ArXivController);
}
interface JQuery {
    collapsible(): void;
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
    to_json = () => {
        return {
            "title": this.title,
            "authors": this.authors,
            "abstract": this.abstract,
            "pdf": this.pdf
        }
    }
}
class Link { }
