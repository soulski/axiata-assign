const Promise = require('bluebird'),
      { MongoClient } = require('mongodb');

const ensureIndexes = (conn) => {
    Promise.coroutine(function* () {
        const message = conn.document('message');
        yield message.ensureIndex({ createDate: -1 }, { backgroup: true });
    });
    
    return conn;
};

module.exports = ({ database }) => {
    const url = `mongodb:\/\/${database.url}:${database.port}/${database.db}`;

    return MongoClient.connect(url, { promiseLibrary: Promise })
        .then(ensureIndexes)
        .then(conn => ({
            database: conn    
        }));
};
