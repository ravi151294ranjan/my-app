/**
 * @module VideoContentSchema
 * @see {@link contents}
 */

 var mongoose = require("mongoose");
 const SCHEMANAME= require('../../config/schemas/schema').VideoContentCollectionName;

 const VideoUploadMeta =  mongoose.Schema({
  _id: false,
  "fileSize":{type: String, required: false},
  "uploadedSize":{type: String, required: false},
  "elapsedTime": {type: String, required: false},
  "totalProgress":{type: String, required: false}
},{strict: false});

 const VideoContentSchema = mongoose.Schema({
    "title": { type: String, required: true },
    "description": { type: String, required: true },
    "language": { type: String, required: true },
    "path": { type: String, required: true},
    "glossary": { type: String, required: true },
    "type": { type: String, required: true, default:'Video' },
    "chapters": [],
    "recordStatus":{ type : String, required : true, default:'active' },
    "uploadMeta":{type :VideoUploadMeta, required: false },
    "createdBy": mongoose.Types.ObjectId,
    "createdAt": { type: Date,  required: false, default: new Date() },
    "updatedBy": mongoose.Types.ObjectId,
    "updatedAt": { type: Date, required: false, default: new Date() },
    
 }, {strict: false});
 


 module.exports.asyncSave = function (data) {
   let db = global.db;
   return new Promise((resolve, reject) => {
    const ContentModel = db.model(SCHEMANAME, VideoContentSchema, SCHEMANAME);
    ContentModel.create(data, (err, result) => {
         if (err) reject(err);
         resolve(result);
     });
   });
 };

 module.exports.asyncFindOne = function (condition, projection) {
  let db = global.db;
  return new Promise((resolve, reject) => {
      const ContentModel = db.model(SCHEMANAME, VideoContentSchema, SCHEMANAME);
      ContentModel.findOne(condition, projection, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncUpsert = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
      const ContentModel = db.model(SCHEMANAME, VideoContentSchema, SCHEMANAME);
      ContentModel.update(condition, data, { upsert: true }, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncUpdateOne = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const ContentModel = db.model(SCHEMANAME, VideoContentSchema, SCHEMANAME);
    ContentModel.updateOne(condition, data, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};