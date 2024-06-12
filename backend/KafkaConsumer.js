const { kafka } = require("./KafkaClient");
const customer = require('./models/customer');
const order = require('./models/Order');

const initConsumer = async () => {
    const consumer = kafka.consumer({
        groupId: 'user-1'
    });
    await consumer.connect();

    await consumer.subscribe({ topic: 'Customer-Details', fromBeginning: true });
    await consumer.subscribe({ topic: 'Order-Details', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const parsedMessage = JSON.parse(message.value.toString());
            console.log(`[${topic}][${partition}][${message.offset}] ${message.value}`);

            try {
                if (topic === 'Customer-Details') {
                    // Process customer data
                    const newCustomer = new customer(parsedMessage);
                    await newCustomer.save();
                    console.log('New Customer saved:', newCustomer);

                } else if (topic === 'Order-Details') {
                    // Process order data
                    const newOrder = new order(parsedMessage);
                    await newOrder.save();
                    console.log('New Order saved:', newOrder);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        },
    });

    console.log('Consumer is running...');
}

initConsumer();
module.exports = { initConsumer }