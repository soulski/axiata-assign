const Koa = require('koa'),
      Router = require('koa-router');

const pkg = require('package.json'),
      helmet = require('koa-helmet');

const app = new Koa(),
      router = new Router();


router.get('/version', ctx => ctx.body = { version: pkg.version });


app
    .use(helmet())
    .use(router.routes())
    .use(router.allowedMethods());
    

module.exports = app;
