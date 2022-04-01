const express = require('express');
const router = express.Router();
const contentStructureCtrl = require('../../controllers/admin/contentStructureCtrl');

router.post('/save-sop-content', contentStructureCtrl.saveContentStructure);
router.post('/get-sop-content', contentStructureCtrl.getSopContent);
router.post('/get-content-by-id', contentStructureCtrl.getContentById);
router.post('/update-sop-content', contentStructureCtrl.updateSopContent);
router.post('/delete-sop-content', contentStructureCtrl.deleteSopContent);

module.exports = router;