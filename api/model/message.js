class Message {

    constructor(sender, content, createDate = new Date()) {
        this.props = { 
            sender,
            content,
            createDate,
        };
    }

    set id(value) {
        this.props.id = value;
    }

    get id() {
        return this.props.id;
    }

    get content() {
        return this.props.content;
    }

    get sender() {
        return this.props.sender;
    }

    get createDate() {
        return this.props.createDate;
    }

}

module.exports = Message;
