const express = require('express');
const router = express.Router();
const adminSharedCtrl = require('../../controllers/admin/sharedCtrl');

router.post('/upload-file', adminSharedCtrl.upload);
router.get('/get-languages', adminSharedCtrl.getLanguages);
router.post('/upload-sop-image', adminSharedCtrl.sopImageUpload)

module.exports = router;

