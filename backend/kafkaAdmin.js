const { kafka } = require("./KafkaClient")

async function init() {
    const admin = kafka.admin();
    console.log("Admin Connecting.....");
    admin.connect();
    console.log("Admin Connected successfully");

    console.log("Creating topics");
    await admin.createTopics({
        topics: [
            {
                topic: "Customer-Details",
                numPartitions: 2
            },
            {
                topic: "Order-Details",
                numpartition: 2
            }
        ],
    });
    console.log("Topic created Successfully [customer-details]");
    console.log("Topic created Successfully [order-details]");

    console.log("Disconecting Admin....");
    await admin.disconnect();
}

init();