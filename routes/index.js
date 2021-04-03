const express = require('express');
const router = express.Router();

// Cheerio HTML
const cheerio = require('cheerio');

// Showdown Markdown to HTML Converter
const showdown = require('showdown');
const showdownConverter = new showdown.Converter();

// Text to Diff for Diff2HTML
const Diff = require('diff');

// Diff2HTML Display
const Diff2html = require('diff2html');

// Bring In the Models
const Connection = require('../db/connect');
const Page = require('../db/page');
const EditHistory = require('../db/edit_history');

// Initialize the DB Connection and Databases
const connection = new Connection('./database.sqlite3');
const page = new Page(connection);
const edit_history = new EditHistory(connection);

page.createTable()
    .then(() => page.createFTS()) // Create Full-Text Search Table
    .then(() => page.createFTSTriggers()) // Create Full-Text Search Triggers
    .then(() => edit_history.createTable()) // Create Edit History Table
    .then(() => {
        page.getByTitle('Main_Page')
            .then((pageResult) => {
                if(!pageResult) {
                    page.initializeMainPage() // Create Main Page
                }
            });
    });

// Start Routes
router.get('/', (req, res) => res.redirect('/page/Main_Page'));

router.get('/page/search', (req, res) => {
    page.getFTS(req.query.search)
        .then((searchResults) => {
            res.render('search/index', {
                searchResults: searchResults
            });
        });
});

router.get('/page/:title', (req, res) => {
    let id = 0;
    let title = req.params.title;;
    let body = '';

    page.getByTitle(req.params.title)
        .then((pageResult) => {
            if(pageResult) {
                id = pageResult.id;
                body = showdownConverter.makeHtml(pageResult.body);
            }
        })
        .then(() => page.getAll()
            .then((pages) => {
                pageLinks = pages.map((page) => {return page.title});
                let $ = cheerio.load(body);
                let links = $('a');

                links.each((index, link) => {
                    if(pageLinks.indexOf($(link).text()) == -1) {
                        $(link).addClass('text-danger');
                    }
                });
                body = $.html();

                res.render('pages/index', {
                    id: id,
                    title: title,
                    body: body
                });
            })
        );
});

router.get('/page/:title/edit', (req, res) => {
    page.getByTitle(req.params.title)
        .then((pageResult) => {
            let id = 0;
            let title = req.params.title;
            let body = '';

            if(pageResult) {
                id = pageResult.id;
                body = pageResult.body;
            }

            res.render('pages/edit', {
                id: id,
                title: title,
                body: body
            });
        });
});

router.post('/page/:id/update', (req, res) => {
    if(req.params.id != 0) {
        page.getByID(req.params.id)
            .then((pageResult) => {
                let originalBody = pageResult.body;
                let newBody = req.body.body;

                edit_history.create(req.body.description, originalBody, newBody, req.params.id);
            })
            .then(() => page.update(req.params.id, req.body.title, req.body.body));
    }
    else {
        page.create(req.body.title, req.body.body)
            .then((pageCreated) => edit_history.create(req.body.description, '', req.body.body, pageCreated.id));
    }

    res.redirect('/page/' + req.body.title)
});

router.get('/page/:title/history', (req, res) => {
    page.getByTitle(req.params.title)
        .then((pageResult) => {
            let id = pageResult ? pageResult.id : 0;
            let pageTitle = req.params.title;

            page.getEditHistory(id)
                .then((history) => {
                    res.render('history/index', {
                        pageTitle: pageTitle,
                        history: history
                    });
                });
        });
});

router.get('/page/:title/history/:id/diff', (req, res) => {
    edit_history.getByID(req.params.id)
        .then((historyResult) => {
            let diff = Diff.createPatch(req.params.title, historyResult.original_body, historyResult.new_body);
            
            let diffJson = Diff2html.parse(diff);
            let historyDiff = Diff2html.html(diffJson, {
                drawFileList: true,
                matching: 'lines',
                outputFormat: 'side-by-side',
            });

            res.render('history/diff', {
                historyResult: historyResult,
                historyDiff: historyDiff
            });
        });
});

module.exports = router;