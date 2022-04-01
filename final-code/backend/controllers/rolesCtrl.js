const rolesMdl = require("../models/admin/rolesModel");
const usersMdl = require("../models/admin/usersModel");
const roleConstants= require('../config/constants').roleRelatedConstants;
exports.fetch = async function (req, res) {
  let response = { success: true, status: 200 };
  try {
    let data = await rolesMdl.asyncFind({rank: { $gt : req.user.rank}}, { name: 1 }).catch((error) => {
      throw new Error(error);
    });
    data = data.map((a) => a.name);
    response.data = data;
    res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.status = 500;
    response.error = error.toString();
    res.status(500).json(response);
  }
};

exports.create = async function (req, res) {
  try {
    let isExists = await rolesMdl.asyncFindOne({name: req.body.name}, {_id:1}).catch((error) => {
      throw new Error(error);
    });
    if(isExists){
      return res.status(400).json({success: false, error: "Role already exists"});
    }

    req.body.rank = roleConstants.userDefinedRoleRank;
    req.body.type = roleConstants.userDefinedRoleType
    req.body.identifier = roleConstants.userDefinedRoleId;
    await rolesMdl.asyncSave(req.body).catch((error) => {
      throw new Error(error);
    });

    res.status(201).json({data: [req.body.name], success: true});
  } catch (error) {
    res.status(500).json({success: false, error: error.toString()});
  }
};

exports.update = async function (req, res) {
  try {
    let isExists = await rolesMdl.asyncFindOne({name: req.body.name}, {_id:1, type: 1}).catch((error) => {
      throw new Error(error);
    });

    if(!isExists){
      return res.status(400).json({success: false, error: "Role doesn't exists"});
    }

    if(isExists.type == "predefined"){
      return res.status(400).json({success: false, error: "Predefined role cannot be renamed"});
    }

    await rolesMdl.asyncUpdate({name: req.body.name}, {name: req.body.newname}).catch((error) => {
      throw new Error(error);
    });

    await usersMdl.asyncUpdate({role: req.body.name}, {role: req.body.newname}).catch((error) => {
      throw new Error(error);
    });

    res.json({data: [], success: true});
  } catch (error) {
    res.status(500).json({success: false, error: error.toString()});
  }
};