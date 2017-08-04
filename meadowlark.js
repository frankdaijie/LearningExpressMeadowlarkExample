var express = require('express');
var formidable = require('formidable')
var fortune = require('./lib/fortune');

var app = express();

// setup handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// Add static files
app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    // res.type('text/plain');
    // res.send('Meadowlark Travel');
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune()
    });
});

app.get('/newsletter', function (req, res) {
    res.render('newsletter', {
        csrf: 'CSRF token goes here'
    });
});

app.post('/process', function(req, res) {
    console.log('Form (form querystring):' + req.query.form);
    console.log('CSRF token (from hidden form field):' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);

    if (req.xhr || req.accepts('json, html') === 'json') {
        res.send({success: true});
    }
    else {
        res.redirect(303, '/thank-you');
    }
});

app.get('/contest/vacation-photo', function(req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            return redirect(303, '/error');
        }

        console.log('received fields:');
        console.log(fields);

        console.log('received files:');
        console.log(files);

        res.redirect(303, '/thank-you');
    });
});

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost' + app.get('port') +
        '; press Ctrl-C to terminate');
});