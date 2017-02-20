
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Bookings = require('./bookings');
var md5 = require('md5');
app.use('/',express.static('public_html'));

var customer = require('./customer');
var admin  =require('./admin');
var flights = require('./flights');
// Admin requests

app.post('/add_flight',function (req,res) {
    admin.addFlight(req.body,function (result) {
        res.end();
    });
});


app.post('/check',function (req,res) {
    admin.checkFlight(req.body,function (result) {
        if(result==1)res.send("no");
        else res.send("yes");
    });
});

app.post('/flights/get', function (req, res) {

    console.log("Flights get request");
    flights.GetDetails({

        source : req.body.source,
        destination : req.body.destination,
        date : req.body.date
    }, function (docs) {

        console.log("Sending Data");
        console.log(docs);

        res.send({
            result : docs
        });

    })


});

// Customer Requests

app.post('/customer/login', function (req, res) {

    //console.log(req);

    var obj = {
        username : req.body.username,
        password : md5(req.body.password)
    };
    console.log("Submit");
    console.log(obj);
    customer.login(obj, function (result, id) {
        console.log("Sending result");
        console.log(result);
        res.send(
            {
                result : result,
                customerId : id
            }
        );
    });
});

app.post('/customer/signup', function (req, res) {
    var obj = {
        username : req.body.username,
        password : md5(req.body.password),
        phone : req.body.phone,
        bookingHistory : []
              };
    customer.signUp(obj, function (result, id) {
        res.send(
            {
                result : result,
                customerId : id
            }
        );
    });
});

app.post('/customer/profile', function (req, res) {

      var obj = {
          username : req.body.username,
          id : req.body.customerId
      };

      customer.GetProfile(obj, function (result, details) {

          res.send({
              result : result,
              user : details
          })

      });


});

// Flight Requests

app.post('/flight/get', function (req, res) {

    flights.GetDetailsById(req.body.id, function (result, docs) {

        res.send({
            result : result,
            docs : docs
        });

    });


});

app.post('/flight/book', function (req, res) {

    flights.BookFlight(req.body.flightId, function (result, docs) {

        if(result == 0)
        {
            res.send({

                result : 0

            });
        }
        else if(result == 1)
        {
            res.send({
                result  : 1
            })
        }
        else
        {
            Bookings.AddBooking(req.body.customerId, req.body.flightId, function () {

                res.send({

                    result : 2
                });

            });
        }

    });

});

app.listen(5000, function () {

    console.log("Server running on port 5000");

});