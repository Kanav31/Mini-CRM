const Customer = require('../models/customer');
const Order = require('../models/Order');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customerId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllCustomers,
    getAllOrders
};
