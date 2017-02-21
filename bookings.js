/**
 * Created by himanshu on 16/2/17.
 */

var mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = "mongodb://airline:airline@ds153689.mlab.com:53689/airlinedbms";
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


module.exports = {

    AddBooking : AddBookings,
    getBookings:getBookings
};