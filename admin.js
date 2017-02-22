const  mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/myproject';

function addFLight(details,callback) {
    mongoClient.connect(url,function (error,database) {
        var handler = database.collection('flight');
        handler.insertOne(
            {
                flightId:details.flightId,
                source:details.source,
                destination:details.destination,
                fare:details.fare,
                timeOfDeparture:details.timeOfDeparture,
                timeOfArrival:details.timeOfArrival,
                totalSeats:details.totalSeats,
                totalAvailable:details.totalAvailable,
                date:details.date
            },function (error,result) {
                assert.equal(error,null);
                flightDup(details,database,function (result) {
                    database.close();
                    callback(1);
                });
            }
        )
    })
}



function flightDup(details,database,callback)
{
    var handler = database.collection('flight-duplicate');

    handler.insertOne(
        {
            flightId:details.flightId,
            source:details.source,
            destination:details.destination,
            fare:details.fare,
            timeOfDeparture:details.timeOfDeparture,
            timeOfArrival:details.timeOfArrival,
            totalSeats:details.totalSeats,
            totalAvailable:details.totalAvailable,
            date:details.date
        },function (error,result) {
            assert.equal(error,null);
            callback();
        }
    );

}


function checkFlight(obj,callback)
{

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);

        var handler = db.collection('flight');
        handler.find({'flightId':obj.flightId}).toArray(function (err,result) {
            assert.equal(err,null);
            if(result.length) {
                db.close();
                callback(1);
            }
            else
            {
                db.close();
                callback(0);
            }
        });
    });
}


module.exports = {
    addFlight:addFLight,
    checkFlight:checkFlight
};