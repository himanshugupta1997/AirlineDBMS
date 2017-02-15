/**
 * Created by himanshu on 16/2/17.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', express.static(__dirname + '/public_html'));


app.listen(5000, function () {

    console.log("Server running on port 5000");

});