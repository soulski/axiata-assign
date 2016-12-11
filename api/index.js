const moment = require('moment'),
      fs = require('fs'),
      server = require('server'),
      startup = require('startup');

const { all, promisify } = require('bluebird');

const readFile = promisify(fs.readFile);


const runStartup = (startups) => config => {
    return all(startups.map(task => task(config)))
        .then(mergeResult)     
        .then(result => [config, result]);
};

const mergeResult = (result) => { 
    return result.reduce((prev, curr) => Object.assign(prev, curr), {});
};

const startServer = (config, result) => {
    const instance = server(config, result);

    instance.listen(process.env.PORT || config.port || 9000, function() { 
        const now = moment().format(), port = this.address().port;
        console.log(`[${now}] Server have been start on port ${port}`);
    });
}

readFile('config.json')
    .then(JSON.parse)
    .then(runStartup(startup))
    .spread(startServer);
