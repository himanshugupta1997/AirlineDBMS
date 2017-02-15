/**
 * Created by himanshu on 16/2/17.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var Router = express.router;

app.get('/', function (req, res) {

    res.render('index', {

    });

});

app.get('/admin', function (req, res) {

    res.render('admin', {

    });

});

app.listen(5000, function () {

    console.log("Server running on port 5000");

});