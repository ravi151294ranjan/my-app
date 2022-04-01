const rolesMdl = require("../../models/admin/rolesModel");
const usersMdl = require("../../models/admin/usersModel");
const roleConstants = require("../../config/constants").roleRelatedConstants;
const localeModel = require("../../models/admin/localeModel");
const uploadMiddleware = require("../../middlewares/upload");
const statusCodesMsgs = require("../../config/statusCodesMsgs")();

const videoContentModel = require('../../models/admin/videoContentModel');
const VIDEO_UPLOAD_PATH = "public/uploads/video-content/";
const S3 = require("./../../classes/aws/services/s3.class");
const FSHELPER = require("./../../classes/helpers/fs.class");
const mongoose = require('mongoose');

exports.upload = async function (req, res) {
  try {
    await uploadMiddleware(req, res).catch((error) => {
      throw new Error(error.message);
    });

    // for HTML upload
    if (req.body.type === "content-upload-html-package") {
      let uploadURL = process.env.baseUrl + req.file.filename;
      return res.status(statusCodesMsgs.statusCode.ok).json({
        data: uploadURL,
        status: statusCodesMsgs.statusCode.ok,
        message: statusCodesMsgs.messages.created,
      });
    }
    //for Image Upload
    if (req.body.type === "content-image") {
      let uploadURL = process.env.baseUrl + req.file.filename;
      return res.status(statusCodesMsgs.statusCode.ok).json({
        data: uploadURL,
        status: statusCodesMsgs.statusCode.ok,
        message: statusCodesMsgs.messages.created,
      });
    }

    // for Video upload
    if (req.body.type === "content-upload-video") {
      //let uploadURL = process.env.baseUrl + req.file.filename;
      let uploadDir = __dirname
        .replace(/\\/g, "/")
        .replace("controllers/admin", "");
      let fullpath = uploadDir + VIDEO_UPLOAD_PATH + req.file.filename;

      let draftVideoRecord = {
        "_id": mongoose.Types.ObjectId(),
        "title": "N/A",
        "description": "N/A",
        "language": "N/A",
        "path": "N/A",
        "glossary": "N/A",
        "recordStatus":"draft",
        "uploadMeta":{
          "fileSize":"0",
          "uploadedSize":"0",
          "elapsedTime": "0",
          "totalProgress":"0"
        },
        "createdBy": (req.user['_id']) ? req.user['_id'] : '',
        "updatedBy": (req.user['_id']) ? req.user['_id'] : ''        
     }

      // adding a draft status for Video
      await videoContentModel.asyncSave(draftVideoRecord).catch((error) => { throw new Error(error) });

      // Adding S3 update;
      let S3Obj = new S3();
      let s3Response = await S3Obj.uploadVideo(fullpath, draftVideoRecord['_id']);
      if (s3Response["status"] === "failure")
        throw new Error(s3Response["error"]);

      // deleting the uploaded temp uploaded file from server
      await FSHELPER.deleteFile(fullpath);

      return res.status(statusCodesMsgs.statusCode.ok).json({
        data: s3Response["body"]["uploadedVideoURL"],
        draftVideoId: draftVideoRecord['_id'],
        status: statusCodesMsgs.statusCode.ok,
        message: statusCodesMsgs.messages.created,
      });
    }
  } catch (error) {
    console.log("UPLOAD failed due to", error);
    return res
      .status(statusCodesMsgs.statusCode.internalServerError)
      .json({ error: error, message: statusCodesMsgs.messages[500] });
  }
};

exports.getLanguages = async function (req, res) {
  try {
    let data = req.body;
    let getRes = await localeModel
      .asyncFind(
        {},
        {
          _id: 0,
          name: 1,
          language_code: 1,
          language_code_identifier: 1,
          is_default: 1,
        }
      )
      .catch((error) => {
        throw new Error(error);
      });
    return res.status(statusCodesMsgs.statusCode.ok).json({
      data: getRes,
      status: statusCodesMsgs.statusCode.ok,
      message: statusCodesMsgs.messages.fetched,
    });
  } catch (error) {
    return res
      .status(statusCodesMsgs.statusCode.internalServerError)
      .json({ error: error, message: statusCodesMsgs.messages[500] });
  }
};


//Update Content - update By ContentId
exports.updateVideoUploadProgress = async function (req, res) {
  try {
    let data = req.body;
    data['updatedAt'] = new Date();
    let condition = {"_id":data.id };
    delete(data["id"]);
    await videoContentModel.asyncUpdateOne(condition, data).catch((error) => { throw new Error(error) });
  
    return res.status(statusCodesMsgs.statusCode.ok).json({status: statusCodesMsgs.statusCode.ok, message: statusCodesMsgs.messages.updated });
  } catch (error) {
    console.error("Failed error", error);
    return res.status(statusCodesMsgs.statusCode.internalServerError).json({status: statusCodesMsgs.statusCode.internalServerError, error: error, message: statusCodesMsgs.messages[500] });
  }
}


exports.sopImageUpload = async function (req, res) {
  console.log('===inside sop image upload=====', req.body)
  try {
    await uploadMiddleware(req, res).catch((error) => {
      throw new Error(error.message);
    });
    //for Image Upload
    console.log('--inside sop image upload----', req.body.type)
      let uploadURL = process.env.baseUrl + req.file.filename;
      console.log('--image path----',uploadURL)
      return res.status(statusCodesMsgs.statusCode.ok).json({
        data: uploadURL,
        status: statusCodesMsgs.statusCode.ok,
        message: statusCodesMsgs.messages.created,
      });
  } catch (error) {
    console.log("UPLOAD failed due to", error);
    return res
      .status(statusCodesMsgs.statusCode.internalServerError)
      .json({ error: error, message: statusCodesMsgs.messages[500] });
  }
};