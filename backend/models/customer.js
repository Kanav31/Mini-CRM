const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        // mongoose validation
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    phone_No: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
    lastVisits: [{
        type: Date,
        default: Date.now
    }],
    maxVisits: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

customerSchema.pre('save', function (next) {
    this.maxVisits = this.lastVisits.length;
    next();
});
const customer = mongoose.model('customer', customerSchema)

module.exports = customer