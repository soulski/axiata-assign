const { ApiError, MultiError, ValidationError } = require('error.js');

module.exports = () => (ctx, next) => next().catch((err) => {
    if (err instanceof MultiError) {
        ctx.status = err.statusCode || err.status || 500; 
        ctx.body = err.getErrors();
        ctx.type = 'application/json';
    }
    else if (err instanceof ApiError) {
        ctx.status = err.statusCode || err.status || 500; 
        ctx.body = { code: err.code, msg: err.cause }; 
        ctx.type = 'application/json';
    }
    else {
        ctx.status = 500; 
        ctx.body = 'Internal error';
        ctx.type = 'text/plain'

        console.dir(err);
    }
});
