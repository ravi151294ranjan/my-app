const usersModel = require('../models/admin/usersModel');
const rolesModel = require('../models/admin/rolesModel');

/**
 * checkApiPermissions middleware to verify the permissions for user
 * @module checkApiPermissionsMiddleware
 */

module.exports = ((req, res, next) => {
    if(req.user.roleType != 'predefined')
        return res.status(403).json({error: 'Permission Denied'});
    next();
})