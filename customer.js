/**
 * Created by himanshu on 16/2/17.
 */


var mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = "mongodb://airline:airline@ds153689.mlab.com:53689/airlinedbms";

// Write your functions here and remember to export them.

function Login(obj, callback) {

    mongoClient.connect(url, function (err, db) {

        var handler = db.collection('customer');
        handler.find({username : obj.username}).toArray(function (err, docs) {

            if(err)
                throw err;
            console.log(docs);
            if(docs.length == 0)
            {
                callback(0, null); // Indication for not existence of username.
            }
            else if(docs[0].password != obj.password)
            {

                callback(1, null); // For wrong password
            }
            else
            {
                callback(2, docs[0].customerId); // Correctness;
            }


        });
    });


}

function SignUp(obj, callback) {

    mongoClient.connect(url, function (err, db) {



        var handler = db.collection('customer');
        handler.find({}).toArray(function (err, docs) {

            if(err)
                throw err;
            obj.customerId = docs.length + 1;
            handler.find({username : obj.username}).toArray(function (err, docs) {

                if(err)
                    throw err;
                if(docs.length)
                {
                    callback(0, null); // Username already exits
                }
                else
                {
                    handler.insertOne(obj, function (err, r) {

                            if(err)
                                throw err;
                            callback(1, obj.customerId);
                        }
                    )
                }

            })

        });

    });

}


module.exports = {

    login : Login,
    signUp : SignUp

};