const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rules: [
        {
            field: { type: String, required: true },
            condition: { type: String, required: true },
            value: { type: mongoose.Schema.Types.Mixed, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const campaign = mongoose.model('campaign', campaignSchema);

module.exports = campaign;
