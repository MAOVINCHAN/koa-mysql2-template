const jwt = require('jsonwebtoken')
const { security } = require('@root/config');

const generateToken = function (id, role) {
    const secretKey = security.secretKey;
    const expiresIn = security.expiresIn;
    const token = jwt.sign({
        id,
        role
    }, secretKey, {
        expiresIn
    })
    return token;
}

const resolveToken = function (token) {
    return jwt.verify(token, security.secretKey)
}

module.exports = {
    generateToken,
    resolveToken
}