const i18n = require('@root/locales');
const qs = require('querystringify')
const { queryParameter, defaultLocale } = require('@root/config');

module.exports = async (ctx, next) => {
    i18n.init(global, ctx);

    const { url } = ctx.request;
    const query = url.split('?')[1] || '';
    const queryObject = qs.parse(query);
    const lang = queryObject[queryParameter];

    global.setLocale(lang ? lang : defaultLocale);
    ctx.setLocale(lang ? lang : defaultLocale);

    await next();
}