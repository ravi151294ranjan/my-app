/* 
Contoller: contentStructureCtrl
Purpose: To maintain different contents structure like POS and Training
Author: Ravi Ranjan
 */
const contentStructureModel = require('../../models/admin/contentStructureModel');
const statusCodesMsgs = require('../../config/statusCodesMsgs')();
const HELPER = require('./../../core/helpers/common.helper');
const SCHEMANAME = require('../../config/schemas/schema');
const mongoose = require("mongoose");

const htmlContentModel = require('../../models/admin/htmlContentModel');
const importedHtmlContentModel = require('../../models/admin/importedHtmlContentModel');
const videoContentModel = require('../../models/admin/videoContentModel');
const rolesModel = require("../../models/admin/rolesModel");
const ObjectId = mongoose.Types.ObjectId;

/*It is for saving sop content*/
exports.saveContentStructure = async function (req, res) {
    let saveResponse = '';
    var regex = /(<([^>]+)>)/ig
    try {
      let data = req.body
      data['createdBy'] =  (req.user['_id']) ? req.user['_id'] : ''
    //   let htmlObj = {
    //     "type": "Imported HTML",
    //     "recordStatus": "draft",
    //     "title": (data.title) ? data.title : "N/A",
    //     "description": (data.description) ? data.description : "N/A",
    //     "language": (data.language) ? data.language : "N/A",
    //     "glossary": (data.glossary) ? data.glossary : "N/A",
    //     "path": (data.path) ? data.path : "N/A",
    //     "createdBy": (req.user['_id']) ? req.user['_id'] : '',
    //     "updatedBy": (req.user['_id']) ? req.user['_id'] : '',
    //     "createdAt": new Date(),
    //     "updatedAt": new Date(),
    //       }
        saveResponse = await contentStructureModel.asyncSave(data).catch((error) => { throw new Error(error) });
        return res.status(statusCodesMsgs.statusCode.ok).json({ id: saveResponse._id, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.created });
      } catch (error) {
      return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
    }
  }

  //Get all contents
  exports.getSopContent = async function (req, res) {

    try {
      let data = req.body;
      // console.log(data['contentType']);
      let limit = data.end;
      let searchByContentTitle = '';
      let filterByStatus = data.filter_status;
      let filterByType = data.filter_type;
      searchByContentTitle = data.searchValue;

      if(data.searchValue){
        searchByContentTitle = data.searchValue
        console.log(searchByContentTitle)
      }
      else{
        searchByContentTitle = ''
      }  
     
     
      let remainingCondition = [
        {
          $match: {
            isDeleted: { $in: filterByStatus },
            contentType: { $in: filterByType },
            title: { '$regex': new RegExp("^" + searchByContentTitle, "i") }
  
          },
        },
      ]
      const contentRes = await contentStructureModel.asyncAggregate(remainingCondition).catch(error => { throw new Error(error) })
      return res.status(statusCodesMsgs.statusCode.ok).json({ data: contentRes, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });    
    } catch (error) {
      return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
    }
}


//Edit Content - Get Content By Id
exports.getContentById = async function (req, res) {
  console.log('==========', req.body)
  try {
    let data = req.body;
    let contentId = data.id;
    let getContentDetails = await contentStructureModel.asyncFindOne({ "_id": contentId }, {}).catch((err) => { throw new Error(err) });
    getContentDetails = (getContentDetails) ? getContentDetails : {}
    return res.status(statusCodesMsgs.statusCode.ok).json({ data: getContentDetails, status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.fetched });
  } catch (error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}


/*It is for updating sop content*/

exports.updateSopContent = async function (req, res) {
  console.log('==== inside update block===', req.body);
  try {
    let data = req.body;
    let sopUpdateData= await contentStructureModel.asyncUpdateOne({ "_id": data['contentId']}, data).catch((er) => { throw new Error(er) });
    return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
  }catch(error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });

  }
}



/*It is for deleting sop content*/

exports.deleteSopContent = async function (req, res) {
  try {
    let data = req.body;
    console.log('=====delete id=====', data.id);
    let sopDeleteData= await contentStructureModel.asyncUpsert({ "_id": data['id']},{isDeleted: 'inactive' }).catch((er) => { throw new Error(er) });
    console.log('-----',sopDeleteData)
    return res.status(statusCodesMsgs.statusCode.ok).json({ status: statusCodesMsgs.statusCode.ok, message: "SOP content deleted successfully."});
  }catch(error) {
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({ status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });

  }
}
