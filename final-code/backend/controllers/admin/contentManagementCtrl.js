/* 
Contoller: contentManagementCtrl
Purpose: To maintain different contents like html5,video
Author: Dhanabalan.cs
 */
const htmlContentModel = require('../../models/admin/htmlContentModel');
const importedHtmlContentModel = require('../../models/admin/importedHtmlContentModel');
const videoContentModel = require('../../models/admin/videoContentModel');
const statusCodesMsgs = require('../../config/statusCodesMsgs')();
const rolesModel = require("../../models/admin/rolesModel");
const HELPER = require('./../../core/helpers/common.helper');
const SCHEMANAME = require('../../config/schemas/schema');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//Get all contents
exports.getContents = async function (req, res) {
  try {
    let data = req.body;
    let limit = data.end;
    let searchByContentTitle = '';
    let filterByStatus = data.filter_status;
    let filterByType = data.filter_type;
    let contentRes = []; let aggregateHtmlBuilder = []; let aggregateCondition = []; let aggregateBuilder = [];
    let is_modify_permission = true;
    if (req.user.rank > 2) {
      is_modify_permission = {
        '$cond': {
          'if': { '$in': ["$creatorDetails._id", [req.user._id]] },
          'then': true,
          'else': false
        }
      }
    }
    if (data.searchFlg && data.searchFlg === true) { searchByContentTitle = data.searchValue; }

    //Text and image based content Condition
    aggregateHtmlBuilder = [
      {
        '$unwind': {
          'path': '$version'
        }
      },
      {
        $match: {
          $expr: { $eq: ["$defaultVersion", "$version.versionId"] }
        }
      },
      {
        '$addFields': {
          'title': '$version.title',
          'description': '$version.description',
          'versionId': '$version.versionId',
          'language': '$version.language',
          'content': '$version.content',
          'path': '$version.path',
          'createdBy': '$version.createdBy',
          'createdAt': '$version.createdAt',
        }
      },
      {
        $project: {
          type: 1, defaultVersion: 1, latestVersion: 1, recordStatus: 1, title: 1,
          description: 1, versionId: 1, language: 1, content: 1, path: 1, createdBy: 1, createdAt: 1
        }
      },
    ]

    if (filterByType.includes("HTML")) {
      aggregateBuilder.push(...aggregateHtmlBuilder)
    }
    if (filterByType.includes("Imported HTML")) {
      let aggregateHtmlPackageBuilder = { $unionWith: { coll: SCHEMANAME.ImportedHtmlCollectionName, pipeline: [{ $set: { primary: SCHEMANAME.ImportedHtmlCollectionName } }] } }
      aggregateBuilder.push(aggregateHtmlPackageBuilder)
    }
    if (filterByType.includes("Video")) {
      let aggregateVideoBuilder = { $unionWith: { coll: SCHEMANAME.VideoContentCollectionName, pipeline: [{ $set: { primary: SCHEMANAME.VideoContentCollectionName } }] } }
      aggregateBuilder.push(aggregateVideoBuilder)
    }
    let remainingCondition = [
      {
        $match: {
          recordStatus: { $in: filterByStatus },
          type: { $in: filterByType },
          title: { '$regex': new RegExp("^" + searchByContentTitle, "i") }

        },
      },
      {
        $lookup:
        {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creatorDetails'
        }
      },
      {
        "$unwind": {
          "path": "$creatorDetails"
        }
      },
      {
        $addFields: {
          'contentCreator': {
            "$concat": [
              {
                $cond: [{ $eq: ['$creatorDetails.firstname', ''] }, "", {
                  $concat: ["$creatorDetails.firstname", " ", "$creatorDetails.lastname", ' (',
                    "$creatorDetails.role", ')']
                }]
              }]
          },
          'is_modify': is_modify_permission
        }
      },
      {
        $project: {
          type: 1,
          defaultVersion: 1,
          latestVersion: 1,
          recordStatus: 1,
          title: 1,
          description: 1,
          versionId: 1,
          language: 1,
          content: 1,
          path: 1,
          createdBy: 1,
          createdAt: 1,
          contentCreator: 1,
          is_modify: 1,
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: data.start },
      { $limit: limit }
    ]
    aggregateBuilder = [...aggregateBuilder, ...remainingCondition];

    aggregateCondition = [
      { $set: { primary: SCHEMANAME.HtmlContentCollectionName } },
      { $unionWith: { coll: SCHEMANAME.ImportedHtmlCollectionName, pipeline: [{ $set: { primary: SCHEMANAME.ImportedHtmlCollectionName } }] } },
      { $unionWith: { coll: SCHEMANAME.VideoContentCollectionName, pipeline: [{ $set: { primary: SCHEMANAME.VideoContentCollectionName } }] } },
      {
        $match: {
          recordStatus: { $in: filterByStatus },
          type: { $in: filterByType },
          title: { '$regex': new RegExp("^" + searchByContentTitle, "i") }

        },
      },
      {
        $lookup:
        {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creatorDetails'
        }
      },
      {
        "$unwind": {
          "path": "$creatorDetails"
        }
      },
      {
        $addFields: {
          'contentCreator': {
            "$concat": [
              {
                $cond: [{ $eq: ['$creatorDetails.firstname', ''] }, "", {
                  $concat: ["$creatorDetails.firstname", " ", "$creatorDetails.lastname", ' (',
                    "$creatorDetails.role", ')']
                }]
              }]
          },
          'is_modify': is_modify_permission
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          language: 1,
          path: 1,
          type: 1,
          recordStatus: 1,
          createdAt: 1,
          contentCreator: 1,
          is_modify: 1,
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: data.start },
      { $limit: limit }
    ];
    contentRes = await htmlContentModel.asyncAggregate(aggregateBuilder).catch(error => { throw new Error(error) });
    return res.status(statusCodesMsgs.statusCode.ok).json({ data: contentRes, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Edit Content - Get Content By Id
exports.getContentById = async function (req, res) {
  try {
    let data = req.body;
    let contentId = data.id;
    let contentType = data.type;
    let dbModel = await HELPER.getDbModelByContentType(contentType);
    let getContentDetails = await dbModel.asyncFindOne({ "_id": contentId }, {}).catch((err) => { throw new Error(err) });
    getContentDetails = (getContentDetails) ? getContentDetails : {}
    return res.status(statusCodesMsgs.statusCode.ok).json({ data: getContentDetails, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Delete Content By _id & content type
exports.deleteContent = async function (req, res) {
  try {
    let data = req.body;
    let contentId = data.id;
    let contentType = data.type;
    let dbModel = await HELPER.getDbModelByContentType(contentType);
    let isExists = await dbModel.asyncFindOne({ "_id": contentId }, { _id: 1 }).catch((err) => { throw new Error(err) });
    if (!isExists) {
      return res.status(statusCodesMsgs.statusCode.noContent).json({ status: statusCodesMsgs.statusCode.noContent, message: "Content doesn't exists" });
    }

    // commenting this code temporarily,  will be enabled when delete is enabled
    if (data.videoPath) {
      let videoFileArray = data.videoPath.split("/");
      let videoFileName = videoFileArray[videoFileArray.length - 1];
      const S3 = require("./../../classes/aws/services/s3.class");
      let S3Obj = new S3();
      let s3Response = await S3Obj.deleteVideo(videoFileName);
      if (s3Response['status'] === "failure") throw new Error(s3Response['error']);
    }
    await dbModel.asyncUpsert({ _id: contentId }, { recordStatus: "inactive" }).catch((er) => { throw new Error(er) });
    res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: "Content deleted successfully." });

  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] })
  }
}

//Update Content - update By ContentId
exports.updateContent = async function (req, res) {
  try {
    let data = req.body;
    data['updatedBy'] = (req.user['_id']) ? req.user['_id'] : '';
    data['updatedAt'] = new Date();
    let contentId = data.id;
    let contentType = data.type;
    let dbModel = await HELPER.getDbModelByContentType(contentType);
    await dbModel.asyncUpdateOne({ _id: data['_id'] }, data).catch((er) => { throw new Error(er) });
    return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Create uploaded Html contents (supports .htm &.html filetypes)
exports.saveImportedHtmlContent = async function (req, res) {
  let saveResponse = '';
  try {
    let data = req.body
    let htmlObj = {
      "type": "Imported HTML",
      "recordStatus": "draft",
      "title": (data.title) ? data.title : "N/A",
      "description": (data.description) ? data.description : "N/A",
      "language": (data.language) ? data.language : "N/A",
      "glossary": (data.glossary) ? data.glossary : "N/A",
      "path": (data.path) ? data.path : "N/A",
      "createdBy": (req.user['_id']) ? req.user['_id'] : '',
      "updatedBy": (req.user['_id']) ? req.user['_id'] : '',
      "createdAt": new Date(),
      "updatedAt": new Date(),
        }
    if (data['htmlPackageContentId'] && (data['fullUpdate'] && data['fullUpdate'] == 1)) {
      //Full Update
      let partialUpdateData= await importedHtmlContentModel.asyncUpdateOne({ "_id": data['htmlPackageContentId']}, {
        "$set": formatHTMLPackageContentData(data, req)
      }).catch((er) => { throw new Error(er) });
      return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
    } else if (data['htmlPackageContentId'] && !data['fullUpdate']) {
      //Check content status active - if active dont update recordStatus 
      let getContentStatus = await importedHtmlContentModel.asyncFindOne({ "_id": data['htmlPackageContentId'] }, {recordStatus: 1, _id:0 }).catch((err) => { throw new Error(err) });
      if(getContentStatus['recordStatus'] && getContentStatus['recordStatus']=='active') {
        data['isActive']=1;
      }
      //Partial Update
      let partialUpdateData= await importedHtmlContentModel.asyncUpdateOne({ "_id": data['htmlPackageContentId']}, {
        "$set": formatHTMLPackageContentData(data, req)
      }).catch((er) => { throw new Error(er) });
      return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
    } else {
      //New Content creation
      saveResponse = await importedHtmlContentModel.asyncSave(htmlObj).catch((error) => { throw new Error(error) });
      return res.status(statusCodesMsgs.statusCode.ok).json({ id: saveResponse._id, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.created });
    }
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Format JSON for Patial Update - HTML5 Package Data
function formatHTMLPackageContentData(data, req) {
  let formattedData = {};
  if((data['fullUpdate'] && data['fullUpdate'] == 1) || (data['isActive'] && data['isActive'] == 1)) {
    formattedData['recordStatus'] = "active";
  } else {
    formattedData['recordStatus'] = "draft";
  }
  formattedData['title'] = (data['title']) ? data['title'] : "N/A";
  formattedData['description'] = (data['description']) ? data['description'] : "N/A";
  formattedData['language'] = (data['language']) ? data['language'] : "N/A";
  formattedData['path'] = (data['path']) ? data['path'] : "N/A";
  formattedData['glossary'] = (data['glossary']) ? data['glossary'] : "N/A";
  formattedData['updatedAt'] =   new Date();
  formattedData['updatedBy'] =   (req.user['_id']) ? req.user['_id'] : '';
  return formattedData;
}

//Create Video contents (supports .mp4 filetype)
exports.saveVideoContent = async function (req, res) {
  try {
    let data = req.body
    data['createdBy'] = (req.user['_id']) ? req.user['_id'] : '';
    data['recordStatus'] = 'active';
    let condition = { _id: data["draftId"] };
    delete (data["draftId"]);
    await videoContentModel.asyncUpdateOne(condition, data).catch((error) => { throw new Error(error) });
    return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.created });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Preview Video Content
exports.previewVideo = async function (req, res) {
  try {
    let contentId = req.params.id;
    let getContentDetails = await videoContentModel.asyncFindOne({ "_id": contentId }, { type: 1, title: 1, description: 1, path: 1, glossary: 1, language: 1, description: 1 }).catch((err) => { throw new Error(err) });
    getContentDetails = (getContentDetails) ? getContentDetails : {}
    return res.status(statusCodesMsgs.statusCode.ok).json({ data: getContentDetails, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Preview Imported HTML Content
exports.previewImportedHtml = async function (req, res) {
  try {
    let contentId = req.params.id;
    let getContentDetails = await importedHtmlContentModel.asyncFindOne({ "_id": contentId }, { type: 1, title: 1, description: 1, path: 1, glossary: 1, language: 1, description: 1 }).catch((err) => { throw new Error(err) });
    getContentDetails = (getContentDetails) ? getContentDetails : {}
    return res.status(statusCodesMsgs.statusCode.ok).json({ data: getContentDetails, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}