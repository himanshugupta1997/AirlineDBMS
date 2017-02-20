/**
 * Created by himanshu on 16/2/17.
 */


var mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = "mongodb://airline:airline@ds153689.mlab.com:53689/airlinedbms";



// Write your functions here and remember to export them.

function GetDetails(obj, callback)
{
    mongoClient.connect(url, function (err, db) {

        if(err)
            throw err;

        var handler = db.collection('flight');
        handler.find(
            {
                source : obj.source,
                destination : obj.destination,
                date : obj.date
            })
            .toArray(function (err, docs ) {

                callback(docs);

        })

    });
}

function GetDetailsUsingId(id, callback) {

    mongoClient.connect(url, function (err, db) {

        if(err)
            throw err;

        var handler = db.collection('flight');
        handler.find({flightId : id}).toArray(function (err, docs) {

            if(err)
                throw err;

            if(docs.length == 0)
            {
                callback(0, docs);
            }
            else
            {
                callback(1, docs);
            }
        });
    });
}

function BookFlight(id, callback) {

    mongoClient.connect(url, function (err, db) {

        if(err)
            throw err;

        var handler = db.collection('flight');
        handler.find({flightId : id}).toArray(function (err, docs) {

            if(err)
                throw err;

            if(docs.length == 0)
            {
                callback(0, docs);
            }
            else
            {
                if(docs[0].totalAvailable == 0)
                {
                    callback(1, docs);
                }
                else
                {
                    --docs[0].totalAvailable;
                    handler.updateOne({flightId : id}, {$set : docs[0]}, function (err, r) {

                        if (err)
                            throw err;

                        console.log("Updated");
                        console.log(r);
                        callback(2, docs);

                    });
                }
            }

        });

    });

}
module.exports = {

    GetDetails : GetDetails,
    GetDetailsById : GetDetailsUsingId,
    BookFlight : BookFlight
};