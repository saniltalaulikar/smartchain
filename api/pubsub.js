const PubNub = require('pubnub');
const Transaction = require('../transaction');


const credentials = {
    publishKey: 'pub-c-213c0295-e1ec-411a-a30b-a503bac87419',
    subscribeKey: 'sub-c-9a233240-9773-11eb-907e-3a7b703d9d8e',
    secretKey: 'sec-c-ZDI1ODVmZDUtMTUwMC00NGQ5LTgwMDItYzYxNzdjNGE4ZjZk'
};

const CHANNELS_MAP = {
    TEST: 'TEST',
    BLOCK: 'BLOCK',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({blockchain, transactionQueue}) {
        this.pubnub = new PubNub(credentials);
        this.blockchain = blockchain;
        this.transactionQueue = transactionQueue;
        this.subscribeToChannels();
        this.listen();
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS_MAP)
        })
    }

    publish({ channel, message }) {
        this.pubnub.publish({channel, message});
    }

    listen() {
        this.pubnub.addListener({
            message: messageObject => {
                const {channel, message} = messageObject;
                const parsedMessage = JSON.parse(message);
                console.log('Message received. Channel', channel);
                
                
                switch (channel) {
                    case CHANNELS_MAP.BLOCK:
                        console.log('block message', message);
                        this.blockchain.addBlock({
                            block:parsedMessage,
                            transactionQueue:this.transactionQueue
                        })
                        .then(() => console.log("New block accepted", parsedMessage))
                        .catch(error => console.error('New block rejected:', error.message));
                        break;
                    default:
                        return;
                    case CHANNELS_MAP.TRANSACTION:
                        console.log(`Received transaction: ${parsedMessage.id}`);   
                        this.transactionQueue.add(new Transaction(parsedMessage) )

                        console.log('this.transactionQueue.getTransactionSeries()',
                            this.transactionQueue.getTransactionSeries()
                        );
                    break;
                }
            }
        });
    }

    broadcastBlock(block) {
        this.publish({
            channel: CHANNELS_MAP.BLOCK,
            message: JSON.stringify(block)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS_MAP.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;

