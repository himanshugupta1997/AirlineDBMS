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

module.exports = {

    GetDetails : GetDetails

};