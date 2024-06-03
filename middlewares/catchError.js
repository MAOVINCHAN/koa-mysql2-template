const { HttpException } = require('@core/exception');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        const isHttpException = error instanceof HttpException;
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev && !isHttpException) {
            console.log('=====' + 'middleware catch error: ', error);
            throw error;
        }

        if (isHttpException) {
            ctx.body = {
                message: error.message,
                error_code: error.errorCode,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.response.status = error.code
        } else {
            ctx.body = {
                message: error?.message ? error.message : ctx.__('unknowError'),
                error_code: 9999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.response.status = 500
        }
    }
}