/**
 * dbConfig module.
 * @module DB Connection
 * 
 */
const mongoose = require('mongoose');
var initialized = false;

/**
 * open database super admin connection at the time of server starting to store global variable.
 * @param  {string} database Its represent database name
 * @param  {string} host Its represent host name
 * @param  {Function} callback Its represent callback funtionif db initialized its excute
 * @type {number}
 */

function initialize(database, host,callback) {
    if (initialized) {
        return callback();
    }
    initialized = true;
       /**
     * Notice the idenfier newFunction given to the member
     * You can now document the function here
     */
    openMongo(callback,host);
}


function openMongo(callback,host) {
    var url = 'mongodb://' + process.env.DB_Address + ':' + process.env.DB_PORT + '/' + process.env.DB;
//    var url='mongodb+srv://elearning:Elearning321@cluster0.nzqy8.mongodb.net/TenantMaster?retryWrites=true&w=majority'
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    // Get the default connection
    const mongooseConnection = mongoose.connection;
    mongooseConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    global.db = mongooseConnection;
    global.clients={}
    global.clientdbconn={}
}

module.exports.initialize = initialize;
module.exports.openMongo = openMongo;