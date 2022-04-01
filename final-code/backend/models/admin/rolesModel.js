/**
 * RolesSchema module to contain schema details
 * @module RolesSchema
 * @see {@link user_Roles}
 */

var mongoose = require("mongoose");

const RolesSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  identifier: { type: String },
  rank: { type: Number, required: true }
}, {strict: true});

module.exports.asyncFind = function (condition, projection) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const RoleModel = db.model("userRoles", RolesSchema, "userRoles");
    let limit;
    if (projection.limit) {
      limit = projection.limit;
      delete projection["limit"];
    } else {
      limit = 0;
    }
    RoleModel.find(condition, projection, { limit: limit }, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.asyncFindOne = function (condition, projection) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const RoleModel = db.model("userRoles", RolesSchema, "userRoles");
    RoleModel.findOne(condition, projection, (err, result) => {
        if (err) reject(err);
        resolve(result);
    });
  });
};

module.exports.asyncSave = function (data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const RoleModel = db.model("userRoles", RolesSchema, "userRoles");
    RoleModel.create(data, (err, result) => {
        if (err) reject(err);
        resolve(result);
    });
  });
};

module.exports.asyncUpsert = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const RoleModel = db.model("userRoles", RolesSchema, "userRoles");
    RoleModel.update(condition, data, { upsert: true }, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports.asyncUpdate = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const RoleModel = db.model("userRoles", RolesSchema, "userRoles");
    RoleModel.update(condition, data, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};


