/**
 * @module VersionHtmlContentSchema
 * @see {@link contents}
 */

 var mongoose = require("mongoose");
 const SCHEMANAME= require('../../config/schemas/schema').HtmlContentCollectionName
 const VersionHtmlContentSchema = mongoose.Schema({
    "title": { type: String, required: true },
    "description": { type: String, required: true },
    "language": { type: String, required: true },
    "content": { type: String, required: true},
    "path": { type: String, required: true},
    "glossary": { type: String, required: true },
    "versionId":{ type : String, required : true},
    "createdBy": mongoose.Types.ObjectId,
    "createdAt": { type: Date, required: false, default: new Date()},
    "updatedBy": mongoose.Types.ObjectId,
    "updatedAt": { type: Date, required: false, default: new Date()},
 }, {strict: false});
