const mongoose = require('mongoose')

const connectDB = (url) => {
    return mongoose.connect(url, {
        serverSelectionTimeoutMS: 50000,
    })
}

module.exports = connectDB