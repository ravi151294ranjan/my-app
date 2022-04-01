/**
 * ContentStructureSchema module to contain schema details
 * @module ContentStructureSchema
 * @see {@link content_Structute_Management}
 */

 var mongoose = require("mongoose");

 const ContentStructureSchema = mongoose.Schema({
   title: { type: String, required: false},
   contentType: { type: String, enum : ['sop','training']},
   imagePath: { type: String, required: false },
   description: { type: String, required: false },
   language: { type: String, required: false },
   status: { type: String, enum : ['draft','active']},
   stepPlan: [{
    _id:{type: mongoose.Types.ObjectId},
     type: { type: String, required: false },
   }],
   stepDoCheck: [{
    _id:{type: mongoose.Types.ObjectId},
    type: { type: String, required: false },
  }],
  stepDoAct: [{
    _id:{type: mongoose.Types.ObjectId},
    type: { type: String, required: false },
  }],
  createdBy: mongoose.Types.ObjectId,
  updatedBy: mongoose.Types.ObjectId,
  isDeleted: {type: String, required: false, default:'active'},
  createdOn: {type: Date, default: Date.now()},
  updatedOn: {type: Date, default: Date.now()}
 }, {strict: true});
 
 module.exports.asyncFind = function () {
   let db = global.db;
   return new Promise((resolve, reject) => {
     const ContentModel = db.model("contentStructure", ContentStructureSchema, "contentStructure");
     ContentModel.find( (err, result) => {
       if (err) reject(err);
       resolve(result);
     });
   });
 };
 
 module.exports.asyncFindOne = function (condition, projection) {
   let db = global.db;
   console.log('---Inside Find one method======')
   return new Promise((resolve, reject) => {
    const ContentModel = db.model("contentStructure", ContentStructureSchema, "contentStructure");
    ContentModel.findOne(condition, projection, (err, result) => {
         if (err) reject(err);
         resolve(result);
     });
   });
 };
 
 module.exports.asyncSave = function (data) {
   let db = global.db;
   return new Promise((resolve, reject) => {
    const ContentModel = db.model("contentStructure", ContentStructureSchema, "contentStructure");
     ContentModel.create(data, (err, result) => {
         if (err) reject(err);
         resolve(result);
     });
   });
 };
 
 module.exports.asyncUpsert = function (condition, data) {
   let db = global.db;
   return new Promise((resolve, reject) => {
    const ContentModel = db.model("contentStructure", ContentStructureSchema, "contentStructure");
     ContentModel.update(condition, data, { upsert: true }, (err, result) => {
       if (err) reject(err);
       resolve(result);
     });
   });
 };
 
 module.exports.asyncUpdate = function (condition, data) {
   let db = global.db;
   return new Promise((resolve, reject) => {
    const ContentModel = db.model("contentStructure", ContentStructureSchema, "contentStructure");
     ContentModel.update(condition, data, (err, result) => {
       if (err) reject(err);
       resolve(result);
     });
   });
 };

 module.exports.asyncUpdateOne = function (condition, data) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const ContentModel = db.model("contentStructure", ContentStructureSchema, "contentStructure");
    ContentModel.updateOne(condition, data, (err, result) => {
          if (err) reject(err);
          resolve(result);
      });
  });
};

module.exports.asyncAggregate = function (aggregateCondition) {
  let db = global.db;
  return new Promise((resolve, reject) => {
  const ContentModel = db.model("contentStructure", ContentStructureSchema, "contentStructure");
   ContentModel.aggregate(aggregateCondition, (err, result) => {
        if (err) reject(err);
        resolve(result);
    });
  });
};
 
 
 