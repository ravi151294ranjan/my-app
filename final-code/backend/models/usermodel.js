
/**
 * UserModel module to perform users operations through User module ..
 * @module User Model
 * @see {@link User}
 */

// var ObjectID = require('mongodb').ObjectID;

const mongoose = require('mongoose');
const usersModel = require('../models/admin/usersModel');
const rolesModel = require('../models/admin/rolesModel');

var admin = require('../models/adminModel');
var tenantModel = require('../models/TenantModel')
var SubscribersDetails_model = require('../models/subscribersModel')
var salt = '1234567890'; // default salt
var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';
module.exports = {
    /**
     * * In create user method first we check the user limit of particular tenant in <b> User </b> & <b> config </b> collections.<br>
     * * The limit is not exceed we insert the data in <b> user </b> collection with find method of username to avoid duplication.<br>
     * * In user insertion we give reference id of that created user in <b> groupinfo </b> collection for the user groups details.<br>
     * * After Tenant based user updation count will be increased in Super Admin Collection based on that Tenant.
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user data.
     */
    createUser: (collectionName, data) => {
        return new Promise(async (resolve, reject) => {

            let res = await usersModel.asyncFindOne({ username: data.username }, {}).catch((err) => reject(err));

            if (res) {
                resolve({
                    success: false,
                    status: 403,
                    message: "Email already exists."
                });
            } else {
                let dataval = await usersModel.asyncSave(data).catch((err) => reject(err));

                resolve({
                    success: true,
                    status: 200,
                    message: "User created successful!",
                    data: {}
                })

            }
        })
    },

    /**
     * * In updation to update user detail and user groups detail in <b> Users </b> & <b> gruopinfo </b> collection.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user data.
     * @param  {string} id to find which user we want to update.
     */
    updateUser: (collectionName, data, userEmail) => {
        return new Promise(async (resolve, reject) => {

            let isExists = await usersModel.asyncFindOne({ email: userEmail }, { id: 1 }).catch((err) => reject(err));

            if (!isExists) { resolve({ success: false, status: 403, message: "User not found." }); }

            await usersModel.asyncUpdate({ email: userEmail }, data).catch((err) => reject(err));

            resolve({ success: true, status: 200, message: "Successfully Updated!" });
        })
    },

    /**
     * * getSingleUser method used to retrive the specific user based on user id.
     * @param  {string} collectionName Its show the collection name.
     * @param  {string} id to find which user we want to get.
     */
    getSingleUser: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            let result = {
                message: "User not found."
            }
            resolve(result)

            // db.collection(collectionName).find({ _id: mongoose.Types.ObjectId(id) }).toArray((err, res) => {
            //     if (err) { reject(err) }
            //     if (res.length == 0) {
            //         let result = {
            //             message: "User not found."
            //         }
            //         resolve(result)
            //     } else {
            //         resolve(res)
            //     }
            // })
        })
    },

    /**
     * * In Deletion method we delete the user details in user & groupinfo colletion based on userid.<br>
     * * After that we  decreased user count in Super Admin Collection based on that Tenant.
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user data to delete based on tenantname.
     */
    deleteUser: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {

            let result = {
                success: false,
                status: 403,
                message: "User not found."
            }
            resolve(result)

            // db.collection(collectionName).find({ _id: mongoose.Types.ObjectId(data.id) }).toArray((err, res) => {
            //     if (err) { reject(err) }
            //     if (res.length == 0) {
            //         let result = {
            //             success: false,
            //             status: 403,
            //             message: "User not found."
            //         }
            //         resolve(result)
            //     } else {
            //         db.collection(collectionName).find({}).toArray((err, deleteres) => {
            //             if(deleteres.length>1){
            //                 db.collection(collectionName).deleteOne({ _id: mongoose.Types.ObjectId(data.id) }, (err, res) => {
            //                     if (err) {
            //                         reject(err)
            //                     }
            //                     let result = {
            //                         success: true,
            //                         status: 200,
            //                         message: "User Deleted successfully!."
            //                     }
            //                     resolve(result)                        

            //                 })
            //             }else{
            //                 let result = {
            //                     success: false,
            //                     status: 403,
            //                     message: "User can't delete. Minimum one user is required."
            //                 }
            //                 resolve(result)
            //             }
            //         })

            //     }
            // })
        })
    },



    /**
     * * Check user have the acces the application.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user deails to verify user credentials or valid or not.
     * @return {Object} Its return Login is success or failure message with user data.
     */
    validateUser: function (collectionName, data) {
        return new Promise(async (resolve, reject) => {

            var query = {
                username: data.username,
                password: data.password
            };

            let resdata = await usersModel.asyncFind(query, { password: 0, username: 0 }).catch((error) => reject(error));

            let result = {
                success: true,
                status: 200,
                message: 'Login Success!',
                response: resdata
            }

            resolve(result);
        })
    },


    /**
     * * In retrieveAllUsers method to get all user records in users colletion.<br>
     * * To get superAdmin false record. Because superAdmin true record is hidden user for super admin access.
     * @param  {string} collectionName Its show the collection name.
     */
    retrieveAllUsers: (collectionName, userLimit) => {
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ "superAdmin": { $ne: true } }).sort({ firstname: 1 }).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res);
            });


        })
    },

    /**
     * * In retrieveAllUsers method to get user records based on pagination count in users colletion.<br>
     * * To get superAdmin false record. Because  what are thr records contain  superAdmin is true which are hidden users for super admin access.
     * 
     * @param  {Object} userInfo Its containt user detail.
     */
    retrieveAllUsers_Limit: (userInfo) => {

        return new Promise(async (resolve, reject) => {
            let userRank = await rolesModel.asyncFindOne({name: userInfo.user.role}, {rank:1}).catch((err) => reject(err));
            let rolesData = await rolesModel.asyncFind({rank: {$gt : userRank.rank} }, {name:1}).catch((err) => reject(err));

            let query = { role: { $in : rolesData.map(role => role.name)} }
            if (userInfo.search_filter) {
                query.firstname = {
                    '$regex': new RegExp("^" + userInfo.searchValue, "i")
                    }
            }

            let skip = parseInt(userInfo.start_user);
            let limit = parseInt(userInfo.end_user);
            let res = await usersModel.asyncFind(query, { limit: limit, skip: skip, sort: { firstname: 1 } }).catch((err) => { console.log(err); reject(err) });

            resolve(res);
        });
    },

    /**
     * * getcountOfuser method to get user count.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data 
     * @return {Object} Its return the count
     */
    getcountOfuser: (collectionName) => {
        return new Promise((resolve, reject) => {

            let result = {
                success: true,
                status: 200,
                totalUser: totalUser.length,
                message: "success."
            }
            resolve(result)

            // let db = global.db;
            // db.collection(collectionName).find().toArray((err, totalUser) => {
            //     if (err) {
            //         reject(err)
            //     }

            //         let result = {
            //             success: true,
            //             status: 200,
            //             totalUser: totalUser.length,
            //             message: "success."
            //         }
            //         resolve(result)
            // })
        })
    },


    verifyUserEmail: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {

            let result = {
                success: true,
                status: 200,
                message: 'User verified successfully.'
            }
            resolve(result)

            // db.collection(collectionName).find({ email: data.email, emailVerified:1}).toArray((err, resdata) => {
            //     if(err){
            //         reject(err)
            //     }

            //     if(resdata.length > 0 ){
            //         db.collection(collectionName).updateOne({ email: data.email, emailVerified:1 }, {
            //             $set: {
            //                 emailVerified:0
            //             }
            //         }, (err, res) => {
            //             if (err) {
            //                 reject(err)
            //             }
            //             let result={
            //                 success: true,
            //                 status: 200,
            //                 message: 'User verified successfully.'
            //             }
            //             resolve(result)
            //         })
            //     }else{
            //         let result={
            //             success: false,
            //             status: 403,
            //             message: 'User already verified.'
            //         }
            //         resolve(result)
            //     }
            // })
        })
    }

}