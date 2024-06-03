const { nanoid } = require("nanoid");

module.exports = {
    isObject: (d) => Object.prototype.toString.call(d) === '[object Object]',
    isArray: (d) => Array.isArray(d),
    nanoid: (d) => d ? nanoid().replace(/^[^a-zA-Z]+/, '') : nanoid(),
}