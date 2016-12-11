module.exports = (msg) => {
    return {
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        createDate: msg.createDate.toISOString(),
    };
};
