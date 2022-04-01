var express = require('express');
var jwt = require('jsonwebtoken');
var errorMsg = require('../utils/errors');
// var secretKey = 'yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw'
var secretKey = require("../config/config")
const usersModel = require('../models/admin/usersModel');
const rolesModel = require('../models/admin/rolesModel');

/**
 * Auth middleware to verify the token and its retun the encoded data 
 * @module AuthMiddleware
 */

module.exports = ((req, res, callback) => {

	/**
	 * Its verify the tooken via JWT.Verify method
	 * @function JwtVerify
	 * @param  {string} reqToken Its represent the encode token details.
	 * @param  {string} secretKey Its represent the secret key.
	 * @return {Objec} Its return decoded data.
	 */
	
	if (!req.headers['x-auth-token']) {
		var err = errorMsg.getError('x-auth-token is required');
		return res.send(err);
	}
	if (req.headers['x-auth-token']) {
		var reqToken = req.headers['x-auth-token'];
		jwt.verify(reqToken, secretKey.secretKey,async  function (err, decoded) {
			//DETAILS : decoded contains t(required details), iat, exp
			if (err) {
				if (err.name === 'TokenExpiredError') { // 'TokenExpiredError'
					res.statusCode = 307;
				} else {
					res.statusCode = 401; //error: JsonWebTokenError: invalid signature
				}
				return res.send((err));
			} else {
				req.username = decoded.id;
				req.user = await usersModel.asyncFindOne({_id: decoded.id}, {role:1, email:1, superAdmin:1}).catch((err) => { return res.send(err)});
				let role = await rolesModel.asyncFindOne({name: req.user.role}, {}).catch((err) => { return res.send(err)});
				req.user.rank = role.rank;
				req.user.roleType = role.type;
				return callback();
			}
		});
	}
})
