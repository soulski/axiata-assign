const moment = require('moment'),
      server = require('./server');

server.listen(process.env.PORT || 9000, function() { 
    const now = moment().format(), port = this.address().port;
    console.log(`[${now}] Server have been start on port ${port}`);
});
