/**
 * LocaleSchema module to contain schema details of Languages in the system
 * @module LocaleSchema
 * @see {@link user_Roles}
 */

var mongoose = require("mongoose");

const LocaleSchema = mongoose.Schema({
  "name": { type: String, required: true, unique: true },
  "language_code": { type: String, required: true },
  "language_code_identifier": { type: String, required: true },
  "is_default":{type:Boolean, default:false},
  "recordStatus":{type : String,required : true},
  "createdBy": mongoose.Types.ObjectId,
  "createdAt": Date,
  "updatedBy": mongoose.Types.ObjectId,
  "updatedAt": Date,
}, {strict: true});

/* SAMPLE JSON 
 {
	"name": "English",
	"language_code": "en",
	"language_code_identifier": "en_US",
	"is_default": true,
  "recordStatus": "active",
	"created_by": ObjectId("5f6e0df726b171094903d8dc"),
	"created_on": "1,622,462,418,525",
	"updated_by": ObjectId("5f6e0df726b171094903d8dc"),
	"updated_on": "1,622,462,418,525"
},
{
	"name": "Spanish",
	"language_code": "sp",
	"language_code_identifier": "es_ES",
	"is_default": false,
  "recordStatus": "active",
	"created_by": ObjectId("5f6e0df726b171094903d8dc"),
	"created_on": "1,622,462,418,525",
	"updated_by": ObjectId("5f6e0df726b171094903d8dc"),
	"updated_on": "1,622,462,418,525"
} */

module.exports.asyncFind = function (condition, projection) {
  let db = global.db;
  return new Promise((resolve, reject) => {
    const LocaleModel = db.model("locale", LocaleSchema, "locale");
    let limit;
    if (projection.limit) {
      limit = projection.limit;
      delete projection["limit"];
    } else {
      limit = 0;
    }
    LocaleModel.find(condition, projection, { limit: limit }, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};