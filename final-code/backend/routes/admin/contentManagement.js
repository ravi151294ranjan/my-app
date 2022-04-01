const express = require('express');
const router = express.Router();
const contentsCtrl = require('../../controllers/admin/contentManagementCtrl');
const versionCtrl = require('../../controllers/admin/versionManagementCtrl');


router.post('/get-contents', contentsCtrl.getContents);
router.post('/get-content-by-id', contentsCtrl.getContentById);
router.post('/delete-content', contentsCtrl.deleteContent);
router.post('/update-content', contentsCtrl.updateContent);

router.post('/save-imported-html-content', contentsCtrl.saveImportedHtmlContent);
router.post('/upload-video', contentsCtrl.saveVideoContent);

router.post('/save-html-content', versionCtrl.saveHtmlContent);
router.post('/get-html-content-by-id', versionCtrl.getHtmlContentById);
router.post('/get-version-list', versionCtrl.getVersionList);

module.exports = router;