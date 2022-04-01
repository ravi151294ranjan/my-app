/* 
Contoller: versionManagementCtrl
Purpose: To maintain Version Controls for HTML Content Type
Author: Dhanabalan.cs
 */

const htmlContentModel = require('../../models/admin/htmlContentModel');
const statusCodesMsgs = require('../../config/statusCodesMsgs')();
const rolesModel = require("../../models/admin/rolesModel");
const HELPER = require('./../../core/helpers/common.helper');
const SCHEMANAME = require('../../config/schemas/schema');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


//Create Embedded Html contents
exports.saveHtmlContent = async function (req, res) {
  let saveResponse = '';
  try {
    let data = req.body
    let htmlObj = {
      "type": "HTML",
      "recordStatus": "draft",
      "defaultVersion": "draft",
      "latestVersion": "draft",
      "version": [
        {
          "versionId": "draft",
          "title": (data.title) ? data.title : "N/A",
          "description": (data.description) ? data.description : "N/A",
          "language": (data.language) ? data.language : "N/A",
          "content": (data.content) ? data.content : "N/A",
          "glossary": (data.glossary) ? data.glossary : "N/A",
          "path": (data.path) ? data.path : "N/A",
          "createdBy": (req.user['_id']) ? req.user['_id'] : '',
          "updatedBy": (req.user['_id']) ? req.user['_id'] : '',
          "createdAt": new Date(),
          "updatedAt": new Date(),
        }
      ]
    }
    if (data['htmlContentId'] && (data['fullUpdate'] && data['fullUpdate'] == 1)) {
      //Full Update
      await htmlContentModel.asyncUpdateOne({ "_id": data['htmlContentId'], "version.versionId" : "draft"}, {
        "$set": await fullUpdateData(data, req).catch(error =>reject (error))
      }).catch((er) => { throw new Error(er) });      
      let getVersionList= await this.getVersionListFn(req).catch((error) => { throw new Error(error) });
      let versionList=(getVersionList[0]['versionId'])?getVersionList[0]['versionId']:[];
      if(versionList.length>data['maxAllowedVersions']) {
        let pullData= await htmlContentModel.asyncUpdateOne({ "_id": data['htmlContentId']},
        {"$pull": {version :{ "versionId": versionList[0] }}}
        ).catch((er) => { throw new Error(er) });
      }
      return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
    } else if (data['htmlContentId'] && !data['fullUpdate']) {
      //Partial Update
      let draftCount = await htmlContentModel.asyncCountDocuments({ "_id": data['htmlContentId'], "version.versionId" : "draft"}, { _id: 1 }).catch((err) => { throw new Error(err) });
      if(draftCount==1) {
        //DRAFT version is available, we can update the data in draft version
        let partialUpdateData= await htmlContentModel.asyncUpdateOne({ "_id": data['htmlContentId'], "version.versionId" : "draft"}, {
          "$set": formatHTMLContentData(data)
        }).catch((er) => { throw new Error(er) });
        return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
      } else {
        let pushData= await htmlContentModel.asyncUpdateOne({ "_id": data['htmlContentId']}, 
        {$push: {version: appendHTMLContentData(data,req)}},{new: true, upsert: true }).catch((er) => { throw new Error(er) });
        let updateRecordStatus=await htmlContentModel.asyncUpdateOne({ "_id": data['htmlContentId']}, 
        {"recordStatus":"draft","defaultVersion":"draft","latestVersion":"draft"}
        ).catch((error) => { throw new Error(error) });
        return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
      }
    } else {
      //New Content creation
      saveResponse = await htmlContentModel.asyncSave(htmlObj).catch((error) => { throw new Error(error) });
      return res.status(statusCodesMsgs.statusCode.ok).json({ id: saveResponse._id, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.created });
    }
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Get Version List API
exports.getVersionList = async function (req, res) {
  try {
   let getVersionDetails = await this.getVersionListFn(req).catch(error => { throw new Error(error) });
    return res.status(statusCodesMsgs.statusCode.ok).json({ data: getVersionDetails, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Edit HTML Content - Get Content By Id
exports.getHtmlContentById = async function (req, res) {
  try {
    let data = req.body;
    let contentId = data.id;
    let versionId = data.versionId;
    aggregateHtmlBuilder = [
      {
        $match: {
          "_id": ObjectId(contentId)
        }
      },
      {
        '$unwind': {
          'path': '$version'
        }
      },
      {
        $match: {
          "version.versionId": versionId
        }
      },
      {
        '$addFields': {
          'title': '$version.title',
          'description': '$version.description',
          'language': '$version.language',
          'content': '$version.content',
          'path': '$version.path',
          'glossary': '$version.glossary',
          'versionId': '$version.versionId',
        }
      },
      {
        $project: {
          title: 1, description: 1, language: 1, path: 1, content: 1, glossary: 1, versionId: 1,
        }
      },
    ]
    let getContentDetails = await htmlContentModel.asyncAggregate(aggregateHtmlBuilder).catch(error => { throw new Error(error) });
    getContentDetails = (getContentDetails[0]) ? getContentDetails[0] : {}
    return res.status(statusCodesMsgs.statusCode.ok).json({ data: getContentDetails, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Preview HTML Content
exports.previewHtml = async function (req, res) {
  try {
    let contentId = req.params.id;
    let getContentDetails ={};
    let version = await htmlContentModel.asyncFindOne({ "_id": contentId }, { defaultVersion: 1, _id: 0 }).catch((err) => { throw new Error(err) });
    //if(version.defaultVersion) {
      aggregateHtmlBuilder = [
        {
          $match: {
            "_id": ObjectId(contentId)
          }
        },
        {
          '$unwind': {
            'path': '$version'
          }
        },
        {
          $match: {
            "version.versionId": version['defaultVersion']
          }
        },
        {
          '$addFields': {
            'title': '$version.title',
            'description': '$version.description',
            'language': '$version.language',
            'content': '$version.content',
            'path': '$version.path',
            'glossary': '$version.glossary',
            'versionId': '$version.versionId',
          }
        },
        {
          $project: {
            title: 1, description: 1, language: 1, path: 1, content: 1, glossary: 1, versionId: 1
          }
        },
      ];
      getContentDetails = await htmlContentModel.asyncAggregate(aggregateHtmlBuilder).catch(error => { throw new Error(error) });
      getContentDetails=(getContentDetails[0])?getContentDetails[0]:{}
      return res.status(statusCodesMsgs.statusCode.ok).json({ data: getContentDetails, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
    //}   
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}

//Format JSON for Patial Update
function formatHTMLContentData(data) {
  let formattedData = {};
  formattedData['version.$.versionId'] =  "draft";
  formattedData['version.$.title'] = (data['title']) ? data['title'] : "N/A";
  formattedData['version.$.description'] = (data['description']) ? data['description'] : "N/A";
  formattedData['version.$.language'] = (data['language']) ? data['language'] : "N/A";
  formattedData['version.$.content'] = (data['content']) ? data['content'] : "N/A";
  formattedData['version.$.path'] = (data['path']) ? data['path'] : "N/A";
  formattedData['version.$.glossary'] = (data['glossary']) ? data['glossary'] : "N/A";
  return formattedData;
}

//Format Json : append this json into version array
function appendHTMLContentData(data,req) {
  let formattedData = {};
  formattedData['versionId'] =  "draft";
  formattedData['title'] = (data['title']) ? data['title'] : "N/A";
  formattedData['description'] = (data['description']) ? data['description'] : "N/A";
  formattedData['language'] = (data['language']) ? data['language'] : "N/A";
  formattedData['content'] = (data['content']) ? data['content'] : "N/A";
  formattedData['path'] = (data['path']) ? data['path'] : "N/A";
  formattedData['glossary'] = (data['glossary']) ? data['glossary'] : "N/A";
  formattedData['createdAt'] =  new Date();
  formattedData['createdBy'] =   (req.user['_id']) ? req.user['_id'] : '';
  formattedData['updatedAt'] =   new Date();
  formattedData['updatedBy'] =   (req.user['_id']) ? req.user['_id'] : '';
  return formattedData;
}

//Format JSON for Full Update
fullUpdateData = function (data, req) {
    return new Promise( async(resolve, reject) => {
      let formattedData = {};
      let finalVersion="1";
      let getVersionList= await this.getVersionListFn(req).catch((error) => { throw new Error(error) });
      let versionList=(getVersionList[0]['versionId'])?getVersionList[0]['versionId']:[]
      let filterDraft = versionList.filter(e => e !== 'draft');
      if (filterDraft.length) {
          let maxVersion=Math.max(...filterDraft)
          finalVersion=maxVersion+1
      }
      formattedData['recordStatus'] = "active";
      formattedData['defaultVersion'] = finalVersion;
      formattedData['latestVersion'] = finalVersion;
      formattedData['version.$.versionId'] = finalVersion.toString();
      formattedData['version.$.title'] = (data['title']) ? data['title'] : "N/A";
      formattedData['version.$.description'] = (data['description']) ? data['description'] : "N/A";
      formattedData['version.$.language'] = (data['language']) ? data['language'] : "N/A";
      formattedData['version.$.content'] = (data['content']) ? data['content'] : "N/A";
      formattedData['version.$.path'] = (data['path']) ? data['path'] : "N/A";
      formattedData['version.$.glossary'] = (data['glossary']) ? data['glossary'] : "N/A";
      resolve(formattedData);
  });
}

//Get Version List
getVersionListFn = function (req) {
  return new Promise( async(resolve, reject) => {
    let data = req.body;
    let contentId = data.htmlContentId;
    let aggregateCondition = [
      {
        $match: {
          "_id": ObjectId(contentId)
        }
      },
      {
        '$addFields': {
          'versionId': '$version.versionId',
          'createdAt': '$version.createdAt',
        }
      },
      {
        $project: {
          _id: 0, versionId: 1, createdAt:1
        }
      },
    ]
    let getVersionDetails = await htmlContentModel.asyncAggregate(aggregateCondition).catch(error =>reject (error));
    resolve(getVersionDetails);    
  });
}