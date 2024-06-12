const CommunicationLog = require('../models/communicationLog');
const Campaign = require('../models/campaign');
const Customer = require('../models/customer');
const Order = require('../models/Order');

const calculateTotalSpendsForCustomers = async () => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: '$customerId',
                    totalSpends: { $sum: '$totalPrice' }
                }
            }
        ]);

        const customerSpends = {};
        orders.forEach(order => {
            customerSpends[order._id] = order.totalSpends;
        });

        return customerSpends;
    } catch (error) {
        console.error('Error calculating total spends for customers:', error);
        return {};
    }
};

const getQualifiedCustomers = async (rules, operator) => {
    try {
        const customerSpends = await calculateTotalSpendsForCustomers();

        let qualifiedCustomerIds = Object.keys(customerSpends).filter(customerId => customerSpends[customerId] > 10000);
        console.log('Qualified Customer IDs:', qualifiedCustomerIds);

        let qualifiedCustomers = await Customer.find({ _id: { $in: qualifiedCustomerIds } });

        if (rules && rules.length > 0) {
            if (operator === 'AND') {
                qualifiedCustomers = qualifiedCustomers.filter(customer => {
                    return rules.every(rule => checkRule(customer, rule));
                });
            } else if (operator === 'OR') {
                qualifiedCustomers = qualifiedCustomers.filter(customer => {
                    return rules.some(rule => checkRule(customer, rule));
                });
            }
        }

        return qualifiedCustomers;
    } catch (error) {
        console.error('Error getting qualified customers:', error);
        return [];
    }
};

const checkRule = (customer, rule) => {
    switch (rule.field) {
        case 'totalSpends':
            const totalSpends = customerSpends[customer._id] || 0;
            return evaluateCondition(totalSpends, rule.condition, rule.value);
        case 'visits':
            return evaluateCondition(customer.maxVisits, rule.condition, rule.value);
        case 'lastVisits':
            const lastVisitedDate = new Date(customer.lastVisit);
            const threeMonthsAgo = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000);
            return evaluateCondition(lastVisitedDate, rule.condition, threeMonthsAgo);
        default:
            return true;
    }
};

const evaluateCondition = (value, condition, threshold) => {
    switch (condition) {
        case '>':
            return value > threshold;
        case '<':
            return value < threshold;
        case '>=':
            return value >= threshold;
        case '<=':
            return value <= threshold;
        case '===':
            return value === threshold;
        case '!==':
            return value !== threshold;
        default:
            return true;
    }
};

const createCampaign = async (req, res) => {
    const { name, rules } = req.body;

    const campaign = new Campaign({
        name,
        rules
    });

    await campaign.save();
    res.status(201).json(campaign);
};

const getCampaigns = async (req, res) => {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
};

const checkAudienceSize = async (req, res) => {
    const { rules } = req.body;

    const audience = await getQualifiedCustomers(rules);

    res.status(200).json({ size: audience.length, audience });
};

const sendCampaign = async (req, res) => {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
    }

    const audience = await getQualifiedCustomers(campaign.rules);

    for (const customer of audience) {
        const log = new CommunicationLog({
            campaignId: campaign._id,
            customerId: customer._id,
            message: `Hi ${customer.name}, here is 10% off on your next order`,
            status: 'PENDING'
        });
        await log.save();

        setTimeout(() => sendDeliveryReceipt(log._id), Math.random() * 5000);
    }

    res.status(200).json({ message: 'Campaign sent', campaign });
};

const sendDeliveryReceipt = async (logId) => {
    const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
    const response = await fetch(`http://localhost:3000/api/v1/campaign/delivery-receipt/${logId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    console.log(data);
};

const updateDeliveryReceipt = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const log = await CommunicationLog.findById(id);

    if (!log) {
        return res.status(404).json({ message: 'Log not found' });
    }

    log.status = status;
    await log.save();

    res.status(200).json({ message: `Status updated to ${status}`, log });
};

module.exports = {
    createCampaign,
    getCampaigns,
    checkAudienceSize,
    sendCampaign,
    updateDeliveryReceipt
};
