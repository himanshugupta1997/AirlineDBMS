/**
 * Created by himanshu on 16/2/17.
 */

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = "mongodb://airline:airline@ds153689.mlab.com:53689/airlinedbms"

mongoClient.connect(url, function (err, db) {

    if(err)
        throw err;

    console.log("Done");
    var handler = db.collection('airline');


});