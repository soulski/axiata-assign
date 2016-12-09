const createMsgInput = require('./input/createMessage.js'),
      listMsgInput = require('./input/listMessage.js');

const msgOutput = require('./output/message.js'); 

const Message = require('model/message.js');

const list = (msgRepo) => (ctx) => {
    const listMessage = msgRepo.list.bind(msgRepo);

    return listMsgInput(ctx)
        .then(listMessage)
        .then(msgs => ctx.body = msgs.map(msgOutput));
};

const create = (msgRepo) => (ctx) => {
    const saveMsg = msgRepo.save.bind(msgRepo);

    return createMsgInput(ctx)
        .then(({ sender, content }) => new Message(sender, content))
        .then(saveMsg)
        .then((msg) => ctx.body = msgOutput(msg));
};

module.exports = ({ messageRepository }) => ({
    list: list(messageRepository),
    create: create(messageRepository),
});
