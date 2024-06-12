const { Kafka } = require('kafkajs');
// 192.168.47.169
//192.168.1.4
const kafka = new Kafka({
    clientId: "Mini-CRM",
    brokers: ["192.168.1.4:9092"],
});

module.exports = { kafka }
