// response structure.
class Resolver {
    success(message = 'success', errorCode = 0, status = 200) {
        return {
            message,
            errorCode,
            status
        }
    }

    fail(message = 'fail', error = {}, errorCode = 10000, status = 500) {
        return {
            message,
            errorCode,
            status,
            error
        }
    }

    json(data, message = 'success', errorCode = 0, status = 200) {
        return {
            data,
            message,
            errorCode,
            status
        }
    }
}

module.exports = Resolver;