const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME} = require('../config/serverConfig')


const createChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        //creating the connection to the amqp server

        const channel = await connection.createChannel();
        // create channel

        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        // assert exchange the messages to the queue depending on the binding_key if no the queue is more than one
        // setting up the distributor
        return channel;
    } catch (error) {
        throw error;
    }
}

const subscribeMessage = async (channel, service, binding_key) => {
    try{
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        channel.consume(applicationQueue.queue, msg  => {
            console.log('received data');
            console.log(msg.content.toString());
            channel.ack(msg);
        });
    } catch (error) {
        throw error;
    }
} 

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch(error){
        throw error;
    }
}

module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}

