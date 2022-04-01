/**
 * @module HtmlContentSchema
 * @see {@link contents}
 */

 var mongoose = require("mongoose");
 const SCHEMANAME= require('../../config/schemas/schema').HtmlContentCollectionName;
 const VersionHtmlContentSchema = require('../../models/admin/versionHtmlContentModel');
 const HtmlContentSchema = mongoose.Schema({
    "type": { type: String, required: true, default:'HTML' },
    "recordStatus":{ type : String, required : true },
    "defaultVersion": { type: String, required: false },
    "latestVersion": { type: String, required: true }, 
    "version": [VersionHtmlContentSchema]
 }, {strict: false});
 

 module.exports.asyncSave = function (data) {
   let db = global.db;
   return new Promise((resolve, reject) => {
    const ContentModel = db.model(SCHEMANAME, HtmlContentSchema, SCHEMANAME);
    ContentModel.create(data, (err, result) => {
         if (err) reject(err);
         resolve(result);
     });
   });
 };

 module.exports.asyncAggregate = function (aggregateCondition) {
  let db = global.db;
  return new Promise((resolve, reject) => {
   const ContentModel = db.model(SCHEMANAME, HtmlContentSchema, SCHEMANAME);
   ContentModel.aggregate(aggregateCondition, (err, result) => {
        if (err) reject(err);
        resolve(result);
    });
  });
};


module.exports.asyncFindOne = function (condition, projection) {
  let db = global.db;
  return new Promise((resolve, reject) => {
      const ContentModel = db.model(SCHEMANAME, HtmlContentSchema, SCHEMANAME);
      ContentModel.findOne(condition, projection, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncUpsert = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
      const ContentModel = db.model(SCHEMANAME, HtmlContentSchema, SCHEMANAME);
      ContentModel.updateOne(condition, data, { upsert: true }, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncUpdateOne = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const ContentModel = db.model(SCHEMANAME, HtmlContentSchema, SCHEMANAME);
    ContentModel.updateOne(condition, data, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncCountDocuments= function (condition) {
  let db = global.db;
  return new Promise((resolve, reject) => {
      const ContentModel = db.model(SCHEMANAME, HtmlContentSchema, SCHEMANAME);
      ContentModel.countDocuments(condition, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};