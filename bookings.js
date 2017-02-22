/**
 * Created by himanshu on 16/2/17.
 */

var mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/myproject';
// Write your functions here and remember to export them.
function AddBookings(customerId, FlightId, callback) {

    mongoClient.connect(url, function (err, db) {

        if(err)
            throw err;

        var handler = db.collection('bookings');
        handler.insertOne({
            customerId : customerId,
            FlightId : FlightId
        }, function (err, r) {

            if(err)
                throw err;
            else
            {
                console.log("Inserted");
                console.log(r);
            }
            callback();

        });
    });

}

function getBookings(callback) {
    mongoClient.connect(url,function (error,database) {
        if(error)throw error;
        var handler = database.collection('bookings');
        handler.find({}).toArray(function (err,result) {
            if(err)throw err;
            database.close();
            callback(result);
        })
    })
}

function CheckBooking(id, callback)
{
    mongoClient.connect(url,function (error,database) {
        if(error)
            throw error;
        var handler = database.collection('bookings');
        handler.find({
            FlightId : id
        }).toArray(function (err,result) {
            if(err)
                throw err;
            database.close();
            if(result.length == 0)
            {
                callback(1);
            }
            else
            {
                callback(0);
            }
        });
    });

}

module.exports = {

    AddBooking : AddBookings,
    getBookings:getBookings,
    CheckBooking : CheckBooking

};