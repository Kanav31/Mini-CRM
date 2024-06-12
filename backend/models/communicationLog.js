const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'campaign' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
    status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
    message: String
});

const communicationLog = mongoose.model('communications_log', communicationLogSchema);

module.exports = communicationLog;
