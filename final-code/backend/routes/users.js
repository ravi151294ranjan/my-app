var express = require('express');
var router = express.Router();
var usermodel = require("../models/usermodel")
const usersCtrl = require("../controllers/usersCtrl");

var mongoose = require('mongoose');
// var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');
var util = require("../utils/util");
// var emailNotification = require('../models/sendEmail')

//router.get('/', usersCtrl.fetch);

router.post('/user-list', usersCtrl.fetch);
// router.post('/', usersCtrl.post);

router.delete('/:email', usersCtrl.delete);

router.post('/', (req, res) => {
  var data = req.body;
  if (!data.email || !data.password) {
    util.writeLog('Invalid Data! username and password both are required', 'post:/user/createUser');
    var error = new Error();
    error.success = false;
    error.status = 400;
    error.message = 'Invalid Data! username and password both are required';
    res.send(error);
  }
  var salt = '1234567890'; // default salt
  var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 24, 'sha512');
  var userStore = {};
  userStore = {
    firstname: data.firstname,
    lastname: data.lastname,
    mobile: data.mobile,
    username: data.email,
    email: data.email,
    role: data.role,
    password: (Buffer.from(hash).toString('hex')),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: data.status,
    createdBy: mongoose.Types.ObjectId(data.createdBy),
    userRegisterd: 0,
    emailVerified: 0,
    firstLogin: 1,
    // pwd: data.password
  };

  const vCreateUser = usermodel.createUser('users', userStore)
  vCreateUser.then((data) => {
    if (data.status == 200) {
      let vUsername = (userStore.email).split('@')
      let emailId = [userStore.email]
      let subject = `User created in ${userStore.tenantName}`
      let message = `${data.firstname} ${data.lastname} user created in ${data.tenantName}.`
      // let htmlMsg = `<!DOCTYPE html>
      // <html>
      // <head>
      // <style>
      // table, th, td {
      //   border: 1px solid black;
      //   border-collapse: collapse;
      // }
      // </style>
      // </head>
      // <body>      
      // <h2>${userStore.tenantName}</h2>
      // <p>${userStore.firstname} ${userStore.lastname} added in ${userStore.tenantName}. And your credentials are mentioned in below. Please 
      
      // <a href="${ process.env.baseUrl}#/pages/login?tendetail=${req.body.tenantEncptdetail}">click here</a> 

      // to access the application.
      // </p>      
      // <table style="width:100%">
      //   <tr>
      //     <th>Username</th>
      //     <th>Password</th> 
      //   </tr>
      //   <tr>
      //     <td>${vUsername[0]}</td>
      //     <td>${userStore.pwd}</td>
      //   </tr>
      // </table>      
      // </body>
      // </html>
      // `
     // var emailMsg = emailNotification.sendMailModel(emailId, subject, message, htmlMsg)
      res.status(200).send(data)
    } else {
      res.status(200).send(data)
    }
  }).catch(err => {
    util.writeLog(`${err} -> createUser Error`, 'post:/users/createUser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User not created';
    res.send(error);
  })

})

router.put('/:id', (req, res) => {
  let useData = req.body
  let userStore = {
    firstname: useData.firstname,
    lastname: useData.lastname,
    mobile: useData.mobile,
    username: useData.email,
    email: useData.email,
    role: useData.role,
    updatedAt: new Date(),
    status: useData.status,
    updatedBy: mongoose.Types.ObjectId(useData.updatedBy),
  };

  if ('password' in useData) {
    var salt = '1234567890'; // default salt
    var hash = crypto.pbkdf2Sync(useData.password, salt, 1000, 24, 'sha512');
    userStore['password'] = (Buffer.from(hash).toString('hex'))
  }
  // if (useData.SelectedGroup != undefined) {
  //   for (var i = 0; i < useData.SelectedGroup.length; i++) {
  //     useData.SelectedGroup[i] = ObjectID(useData.SelectedGroup[i]);
  //   }
  //   userStore['SelectedGroup'] = useData.SelectedGroup
  // }
  const vUpdateUser = usermodel.updateUser('users', userStore, req.params.id)
  vUpdateUser.then((data) => {
    res.status(200).send(data)
  })
})


/**
 * Sends a HTTP GET request to get user record in users collection.
 * </br>
 * @function getSingleUser
 * 
 * @function
 * @path {get} path /users/getUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param :id {string} Id is used to get specific user. it represent _id.
 * @param {Function}  usermodel.getSingleUser() This function is used call getSingleUser() from users 
 * routes to user model to get specific record in database
 * @return {Object} Its return success or failure message with data.
 */
router.get('/getUser/:id', (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    var vGetUser = usermodel.getSingleUser('users', id)
    vGetUser.then((data) => {
      if (data.message) {
        res.status(404).send(data)
      }
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> getUser Error`, 'get:/users/getUser/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'User not found ';
      res.send(error);
    })
  } else {
    util.writeLog('getUser Error', 'get:/users/getUser/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Userid not found ';
    res.send(error);
  }

})

/**
 * Sends a HTTP DELETE request to delete user record in users collection.
 * </br>
 * @function deleteUser
 * 
 * @function
 * @path {delete} path /users/deleteUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param  {string}   id/:TenantId/:tenantName /deleteUser/ 
 * @param {Function}  usermodel.deleteUser() This function is used call deleteUser() from users 
 * routes to user model to delete specific record in database
 * @return {Object} Its return success or failure message.
 */

router.delete('/deleteUser/:id', (req, res) => {
  if (req.params.id != undefined || req.params.id != 'undefined' || req.params.id != null) {
    let dataval = req.params;
    var vDeleteUser = usermodel.deleteUser('users', dataval)
    vDeleteUser.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> delete Error`, 'delete:/users/deleteUser');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'User not found ';
      res.send(error);
    })
  } else {
    util.writeLog('delete Error', 'delete:/users/deleteUser/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User id not found ';
    res.send(error);
  }
})

router.post('/getAllUser_Limit', async (req, res, next) => {
  const userInfo = req.body
  userInfo.user = req.user;
  var vUserModel = usermodel.retrieveAllUsers_Limit(userInfo)
  vUserModel.then(function (data) {
    if (data.length > 0) {
      let result = {
        success: true,
        status: 200,
        data: data
      }
      res.status(200).send(result);
    } else {
      let result = {
        success: false,
        data: '',
        status: 403,
        message: "User not found."
      }
      res.status(200).send(result);
    }
  }).catch(err => {
    util.writeLog(`${err} -> getAllUser_Limit Error`, 'get:/users/getAllUser_Limit');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Users not found ';
    res.send(error);
  })
});


/**
 * getcountOfuser method to get count of users
 * @path {post} path /users/getcountOfuser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  usermodel.getcountOfuser() This function is used call getcountOfuser() from users 
 * routes to user model to get the count.
 * @return {Object} Its return success or failure message with count. 
 */
router.get("/getcountOfuser", async (req, res) => {
  try {
    var vgetcountOfuser = await usermodel.getcountOfuser('users')
    if (vgetcountOfuser.success) {
      res.status(200).send(vgetcountOfuser);
    } else {
      let result = {
        success: false,
        status: 403,
        message: "data not found"
      }
      res.status(200).send(result);
    }
  } catch (e) {
    util.writeLog(`${e} -> User count`, 'post:/users/getcountOfuser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User count not calculate';
    res.send(error);
  }

})

module.exports = router;