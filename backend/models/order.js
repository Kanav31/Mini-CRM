const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: [true, 'Please provide customer id']
    },
    product_name: {
        type: String,
        required: [true, 'Please provide product name']
    },
    totalPrice: {
        type: Number,
        required: [true, 'Please provide total price']
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
})

const order = mongoose.model('order', orderSchema)

module.exports = order