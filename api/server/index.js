const pkg = require('package.json'),
      helmet = require('koa-helmet'),
      body = require('koa-body'),
      cors = require('koa-cors');
      convert = require('koa-convert'),
      error = require('./middleware/error.js'),
      handler = require('handler');

const Koa = require('koa'),
      Router = require('koa-router'),
      MessageRepository = require('repository/message.js');

module.exports = (config, startup) => {
    const app = new Koa(),
          router = new Router(),
          formBody = convert(body());

    const messageRepository = new MessageRepository(startup.database);

    const messageHandler = handler.message({ messageRepository });

    router.get('/version', ctx => ctx.body = { version: pkg.version });
    router.post('/message', formBody, messageHandler.create);
    router.get('/message', formBody, messageHandler.list);


    app
        .use(convert(cors({ origin: '*' })))
        .use(error())
        .use(helmet())
        .use(router.routes())
        .use(router.allowedMethods());
    
    return app;
};
