const express = require('express');
const router = express.Router();
const rolesCtrl = require('../controllers/rolesCtrl');

router.get('/', rolesCtrl.fetch);
router.post('/', rolesCtrl.create);
router.put('/', rolesCtrl.update);


module.exports = router;