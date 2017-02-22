
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
const url = 'mongodb://localhost:27017/myproject';
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

app.post('/getflights',function (req,res) {
    flights.getAllFlights(function (result) {
        res.send(result);
    })
});

app.post('/delete-flight',function (req,res) {

    flights.deleteFLight(req.body.id,function (err,result) {
        res.end();
    })
});


app.post('/bookings-history',function (req,res) {
    Bookings.getBookings(function (result) {
        console.log(result);
        customer.getCustomers(function (result2) {
            flights.getAllFlightsDuplicate(function (result3) {
                var obj  = {};
                obj.bookings = result;
                obj.customers = result2;
                obj.flights = result3;
                res.send(obj);
            });
        });

    })
});

app.post('/flights/checkBooking', function (req, res) {

    Bookings.CheckBooking(req.body.id, function (result) {

        res.send({
            result : result
        });

    });


});

/*
var mongod = require('mongodb');
var MongoClient = mongod.MongoClient;

MongoClient.connect(url , function (err, db) {

    if(err)
        throw err;

    var handler = db.collection('flight');

    handler.deleteMany({}, function (err, r) {

        if(err)
            throw err;

        console.log("Deleted");
        console.log(r);

    });
    handler = db.collection('customer');

    handler.deleteMany({}, function (err, r) {

        if(err)
            throw err;

        console.log("Deleted");
        console.log(r);

    });
    handler = db.collection('flight-duplicate');

    handler.deleteMany({}, function (err, r) {

        if(err)
            throw err;

        console.log("Deleted");
        console.log(r);

    });
    handler = db.collection('bookings');

    handler.deleteMany({}, function (err, r) {

        if(err)
            throw err;

        console.log("Deleted");
        console.log(r);

    });


} );

*/


app.listen(5000, function () {

    console.log("Server running on port 5000");

});