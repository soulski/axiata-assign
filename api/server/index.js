const Koa = require('koa'),
      Router = require('koa-router');

const pkg = require('package.json'),
      helmet = require('koa-helmet'),
      error = require('./middleware/error.js');

const app = new Koa(),
      router = new Router();


router.get('/version', ctx => ctx.body = { version: pkg.version });


app
    .use(error())
    .use(helmet())
    .use(router.routes())
    .use(router.allowedMethods());
    

module.exports = app;
