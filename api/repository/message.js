const _ = require('lodash');

const Message = require('model/message.js');

const serialize = (model) => {
    const obj = _.pick(model, ['sender', 'content']);
    obj.createDate = model.createDate;

    if (model.id) {
        obj._id = model.id;
    }

    return obj;
};

const deserialize = (obj) => {
    const msg = new Message(obj.sender, obj.content, obj.createDate);

    msg.id = obj._id;

    return msg;
};

class MessageRepository {
    
    constructor(db) {
        this.collection = db.collection('message');
    }

    save(msg) {
        return this.collection.insertOne(serialize(msg))
            .then(({ insertedId }) => {
                msg.id = insertedId;    
                return msg;
            });
    }

    list({ startDate, endDate }) {
        const query = {};

        if (startDate || endDate) {
            query.createDate = Object.assign(
                query.createDate || {}, 
                startDate ? { $gt: startDate } : {},
                endDate ? { $lte: endDate } : {}
            ); 
        }

        return this.collection.find(query)
            .sort([['createDate', 1]])
            .limit(100)
            .toArray()
            .then(collections => collections.map(deserialize))
    }

}

module.exports = MessageRepository;
