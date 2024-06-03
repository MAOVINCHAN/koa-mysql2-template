const { I18n } = require('i18n');

const i18n = new I18n({
    locales: ['en', 'zh-CN'],
    directory: __dirname,
})

module.exports = i18n;