/**
 * UsersSchema module to contain schema details
 * @module UsersSchema
 * @see {@link users}
 */

var mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
    "firstname": {type: String, required: true},
    "lastname": {type: String, required: true},
    "mobile": {type: String, required: true},
    "username": {type: String, required: true},
    "email": {type: String, required: true},
    "role": {type: String, required: true},
    "password": {type: String, required: true},
    "status": {type: String, required: true},
    "superAdmin": { type: Boolean, default: false},
    "userRegisterd": Number,
    "emailVerified": Number,
    "firstLogin": Number,
    "createdBy": mongoose.Types.ObjectId,
    "createdAt": Date,
    "updatedBy": mongoose.Types.ObjectId,
    "updatedAt": Date,
}, { strict: false });

module.exports.asyncFind = function (condition, projection) {

    let db = global.db;
    return new Promise((resolve, reject) => {
        const UserModel = db.model("users", UsersSchema, "users");
        let options = {}
        if (projection.limit) {
            options.limit = projection.limit;
            delete projection["limit"];
        } else {
            options.limit = 0;
        }

        if (projection.sort) {
            options.sort = projection.sort;
            delete projection["sort"];
        }
        UserModel.find(condition, projection, options, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports.asyncUpdate = function (condition, data) {
    let db = global.db;
    return new Promise((resolve, reject) => {
        const UserModel = db.model("users", UsersSchema, "users");
        UserModel.update(condition, data, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports.asyncUpsert = function (condition, data) {
    let db = global.db;
    return new Promise((resolve, reject) => {
        const UserModel = db.model("users", UsersSchema, "users");
        UserModel.update(condition, data, { upsert: true }, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports.asyncFindOne = function (condition, projection) {
    let db = global.db;
    return new Promise((resolve, reject) => {
        const UserModel = db.model("users", UsersSchema, "users");
        UserModel.findOne(condition, projection, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports.asyncSave = function (data) {
    let db = global.db;
    return new Promise((resolve, reject) => {
        const UserModel = db.model("users", UsersSchema, "users");
        UserModel.create(data, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports.asyncAggregate = function (condition) {
    let db = global.db;
    return new Promise((resolve, reject) => {
        const UserModel = db.model("users", UsersSchema, "users");
        UserModel.aggregate(condition, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}