/**
 * @module ImportedHtmlContentSchema
 * @see {@link contents}
 */

 var mongoose = require("mongoose");
 const SCHEMANAME= require('../../config/schemas/schema').ImportedHtmlCollectionName
 const ImportedHtmlContentSchema = mongoose.Schema({
    "title": { type: String, required: true },
    "description": { type: String, required: true },
    "language": { type: String, required: true },
    "path": { type: String, required: true},
    "glossary": { type: String, required: true },
    "type": { type: String, required: true, default:'Imported HTML' },
    "recordStatus":{ type : String, required : true, default:'active' },
    "createdBy": mongoose.Types.ObjectId,
    "createdAt": { type: Date,  required: false, default: new Date() },
    "updatedBy": mongoose.Types.ObjectId,
    "updatedAt": { type: Date, required: false, default: new Date() },
 }, {strict: false});
 

 module.exports.asyncSave = function (data) {
   let db = global.db;
   return new Promise((resolve, reject) => {
    const ContentModel = db.model(SCHEMANAME, ImportedHtmlContentSchema, SCHEMANAME);
    ContentModel.create(data, (err, result) => {
         if (err) reject(err);
         resolve(result);
     });
   });
 };

 module.exports.asyncFindOne = function (condition, projection) {
  let db = global.db;
  return new Promise((resolve, reject) => {
      const ContentModel = db.model(SCHEMANAME, ImportedHtmlContentSchema, SCHEMANAME);
      ContentModel.findOne(condition, projection, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncUpsert = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
      const ContentModel = db.model(SCHEMANAME, ImportedHtmlContentSchema, SCHEMANAME);
      ContentModel.update(condition, data, { upsert: true }, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncUpdateOne = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const ContentModel = db.model(SCHEMANAME, ImportedHtmlContentSchema, SCHEMANAME);
    ContentModel.updateOne(condition, data, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};