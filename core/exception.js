class HttpException extends Error {
    constructor(message = global.__('serverError'), errorCode = 10000, code = 400) {
        super();
        this.code = code;
        this.message = message;
        this.errorCode = errorCode;
    }
}

class ParameterException extends HttpException {
    constructor(message, errorCode) {
        super()
        this.code = 400
        this.message = message || global.__('paramsError');
        this.errorCode = errorCode || 10000
    }
}

class AuthFailed extends HttpException {
    constructor(message, errorCode) {
        super()
        this.code = 401
        this.message = message || global.__('authFailed');
        this.errorCode = errorCode || 10004
    }
}

class NotFound extends HttpException {
    constructor(message, errorCode) {
        super()
        this.code = 404
        this.message = message || global.__('notFound');
        this.errorCode = errorCode || 10005
    }
}

class Forbidden extends HttpException {
    constructor(message, errorCode) {
        super()
        this.code = 403
        this.message = message || global.__('forbidden');
        this.errorCode = errorCode || 10006
    }
}

class Existing extends HttpException {
    constructor(message, errorCode) {
        super()
        this.code = 412
        this.message = message || global.__('exist');
        this.errorCode = errorCode || 10006
    }
}

module.exports = {
    HttpException,
    ParameterException,
    AuthFailed,
    NotFound,
    Forbidden,
    Existing
}
