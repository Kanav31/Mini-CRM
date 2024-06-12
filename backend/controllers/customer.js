const { publishMessage } = require('../KafkaProducer')

const createCustomer = async (req, res) => {
    const { name, email, phone_No, lastVisits } = req.body;
    if (!name || !email || !phone_No, !lastVisits) {
        return res.status(400).json({ message: 'Please provide all the required fields' })
    }
    const customerData = {
        name,
        email,
        phone_No,
        lastVisits,
    };
    try {
        // publishing customer details to Kafka
        await publishMessage("Customer-Details", customerData);

        res.status(201).json({ message: 'Customer creating request successfully send to kafka consumer' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createCustomer }