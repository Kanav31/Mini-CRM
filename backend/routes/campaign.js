const express = require('express');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');
const { createCampaign, getCampaigns, checkAudienceSize, sendCampaign, updateDeliveryReceipt } = require('../controllers/campaign');

const router = express.Router();

router.post('/create', ensureAuthenticated, ensureAdmin, createCampaign);
router.get('/', ensureAuthenticated, ensureAdmin, getCampaigns);
router.post('/check-audience-size', ensureAuthenticated, ensureAdmin, checkAudienceSize);
router.post('/send/:id', ensureAuthenticated, ensureAdmin, sendCampaign);
router.post('/delivery-receipt/:id', updateDeliveryReceipt);

module.exports = router;
