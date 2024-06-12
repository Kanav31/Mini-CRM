const { publishMessage } = require('../KafkaProducer');

const createOrder = async (req, res) => {
    const { customerId, product_name, totalPrice } = req.body;

    if (!customerId || !product_name || !totalPrice) {
        return res.status(400).json({ error: 'Fields are required' });
    }

    const orderData = {
        customerId,
        product_name,
        totalPrice
    };

    try {

        // publishing order details to Kafka
        await publishMessage("Order-Details", orderData);

        res.status(201).json({ message: 'Order craeting request successfully send to Kakfka consumer' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

module.exports = { createOrder };
