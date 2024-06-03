module.exports = {
    port: 3000,
    database: {
        database: 'test_db',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'your password'
    },
    security: {
        secretKey: 'your secret key',
        expiresIn: 60 * 60 * 24 // 60 * 60 = expiration time = 1h
    },
    prefix: '/api/v1',
    defaultLocale: 'en', // i18n
    queryParameter: 'lang', // i18n
}
