const _ = require('lodash/fp');

const { MultiError, ValidationError } = require('error.js');

const ajv = require('ajv')({
    'removeAdditional': true,
    'coerceTypes': true,
    'allErrors': true
});

ajv.addKeyword('convert', {
    type: 'string',
    compile: function(schema, parentSchema) {
        return parentSchema.format === 'date-time' && schema 
            ? function(value, objectKey, object, key) {
                object[key] = new Date(value);
                return true;
            } 
            : function () {
                return true;
            }
    }
})

const convertValueJSON = (object) => {
    return _.keys(object).reduce((prev, curr) => {
        prev[curr] = _.isString(object[curr]) 
            ? JSON.parse(object[curr]) 
            : object[curr];

        return prev;
    }, {});
};

const defaultParser = (ctx) => {
    if (ctx.method === 'GET' || ctx.method === 'DELETE') {
        const query = ctx.request.query || {},
              params = ctx.params || {};

        return Object.assign(query, params);
    }
    else {
        let params = ctx.params || {};

        if (ctx.is('application/json')) {
            params = Object.assign(params, ctx.request.body);
        }
        else if (ctx.is('application/x-www-form-urlencoded')) {
            const { fields, files } = ctx.request.body;
            const { json } = convertValueJSON(fields);
            params = Object.assign(params, json, files);
        }
        else if (ctx.is('multipart/form-data')) {
            const { fields, files } = ctx.request.body;
            const { json } = convertValueJSON(fields);
            params = Object.assign(params, json, files);
        }

        return params;
    }
};

const createError = (e) => {
    const { keyword }= e;

    if (keyword === 'required') {
        const name = e.params.missingProperty;
        return new ValidationError(
            name,
            `${name} is required`
        ); 
    }
    else if (keyword === 'enum') {
        const name = e.dataPath.substr(e.dataPath.lastIndexOf('.') + 1);
        return new ValidationError(
            name,
            `${name} only allows [${e.params.allowedValues}]`
        ); 
    }
    else if (keyword === 'minimum' || keyword === 'maximum') {
        const name = e.dataPath.substr(e.dataPath.lastIndexOf('.') + 1);
        return new ValidationError(
            name,
            `${name} ${e.message}`
        ); 
    }
    else if (keyword === 'format') {
        const name = e.dataPath.substr(e.dataPath.lastIndexOf('.') + 1);
        return new ValidationError(
            name,
            `${name} ${e.message}`
        ); 
    }

    return e;
};

module.exports = (schema, parser = defaultParser) => {
    const validate = ajv.compile(schema);

    return (ctx, options = {}) => {
        let input = parser(ctx);

        if (options.extraInput) {
            input = _.extend(input, options.extraInput);
        }

        if (validate(input)) {
            return Promise.resolve(input);
        }
        else {
            const errors = validate.errors.map(createError);
            return Promise.reject(new MultiError(errors));
        }
    };
}
