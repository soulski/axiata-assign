const input = require('./input.js');

const schema = {
    'required': ['sender', 'content'],
    'properties': {
        'sender': { 'type': 'string' },
        'content': { 'type': 'string' },
    },
};

module.exports = input(schema);
