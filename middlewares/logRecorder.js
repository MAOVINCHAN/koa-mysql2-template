const logger = require('@root/utils/log')();

module.exports = async (ctx, next) => {
    const startTime = new Date();

    await next();

    const endTime = new Date();
    const latency = endTime - startTime;

    const { request, response, body } = ctx;
    const logData = {
        method: request.method,
        url: request.url,
        status: response.status,
        latency: `${latency}ms`,
        ip: request.header['x-forwarded-for'] || request.socket.remoteAddress,
        message: body?.message ? body.message : response.message
    };

    logger.info(logData);
};
