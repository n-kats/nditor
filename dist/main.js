var app = angular.module('nditor', []), exec = require('child_process').exec, spawn = require('child_process').spawn, xml2js = require('xml2js'), http = require('http');
var nditor;
(function (nditor) {
    var OutlineController = (function () {
        function OutlineController() {
            this.name = "nditor";
            this.main_size = 70;
            this.nav_size = 30;
            this.main_tab = "";
            this.sidenav_state = "";
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
            this.query = '?search_query=all:math.GT&max_results=25&sortBy=lastUpdatedDate&sortOrder=descending';
            this.papers = [];
            this.load();
        }
        ArXivController.prototype.load = function () {
            var _this = this;
            var url = ArXivController.api_url + this.query;
            http.get(url, function (res) {
                var body = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    xml2js.parseString(body, {
                        trim: true,
                        explicitArray: false
                    }, function (err, data) {
                        for (var i = 0; i < data.feed.entry.length; i++) {
                            var entry = data.feed.entry[i];
                            var paper = new ArXivPaper(entry.title, entry.author, entry.summary, new Link());
                            _this.papers.push(paper);
                        }
                        _this.showup();
                    });
                });
            });
        };
        ArXivController.prototype.showup = function () {
            setTimeout(function () {
                $('.collapsible').collapsible();
            }, 1000);
        };
        ArXivController.api_url = 'http://export.arxiv.org/api/query';
        return ArXivController;
    })();
    nditor.ArXivController = ArXivController;
    app.controller('outlineCtrl', OutlineController);
    app.controller('editorCtrl', EditorController);
    app.controller('arxivCtrl', ArXivController);
})(nditor || (nditor = {}));
var ArXivPaper = (function () {
    function ArXivPaper(title, authors, abstract, pdf) {
        var _this = this;
        this.to_json = function () {
            return {
                "title": _this.title,
                "authors": _this.authors,
                "abstract": _this.abstract,
                "pdf": _this.pdf
            };
        };
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
