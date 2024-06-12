const { kafka } = require("./KafkaClient");

const producer = kafka.producer();

const initProducer = async () => {
    console.log("Connecting Producer");
    await producer.connect();
    console.log("Producer Connected Successfully");
}

const publishMessage = async (topic, value) => {
    try {
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(value) },
            ],
        });
        console.log("Message Published Successfully", value);
    } catch (error) {
        console.log("Error in publishing message", error);
    }
}

initProducer();

module.exports = { publishMessage };