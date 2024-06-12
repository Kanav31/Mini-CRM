const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');
const { getAllCustomers, getAllOrders } = require('../controllers/admin');

router.use(ensureAuthenticated);

router.get('/user-details', (req, res) => {
    console.log(req.user); // Log the user details
    res.json(req.user); // Send user details as response
});

router.get('/customers', ensureAdmin, getAllCustomers);
router.get('/orders', ensureAdmin, getAllOrders);

module.exports = router;
