class ExtendableError extends Error {

    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message; 

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else { 
            this.stack = (new Error(message)).stack; 
        }
    }

}  

class ApiError extends ExtendableError {

    constructor(type) {
        super(type.msg);

        this.code = type.code;
        this.cause = type.msg;
        this.statusCode = 400;
        this.expose = true;
    }

    getCode() {
        return this.code;
    }

    getCause() {
        return this.cause;
    }

}

class MultiError extends ApiError {

    constructor(errors) {
        super({
            code: '0000',
            msg: 'Multiple error occur'
        });

        this.errors = errors
    }

    getErrors() {
        return this.errors.map(error => ({
            code: error.code,
            field: error.name,
            msg: error.cause,
        }));
    }

}

class ValidationError extends ApiError {

    constructor(name, cause) {
        super({
            code: '0001',
            msg: cause 
        });

        this.name = name;
    }
                            
}

module.exports = {
    ApiError, MultiError, ValidationError
};
