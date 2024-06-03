const errors = require('./exception')
const { isEmpty } = require('@utils/withValue');

module.exports = {
    init: () => {
        global.errors = errors;

        global.isEmpty = isEmpty;
    }
}