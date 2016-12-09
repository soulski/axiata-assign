const input = require('./input.js');

const schema = {
    'properties': {
        'startDate': { 'type': 'string', 'format': 'date-time', 'convert': true },
        'endDate': { 'type': 'string', 'format': 'date-time', 'convert': true },
    },
};

module.exports = input(schema);
