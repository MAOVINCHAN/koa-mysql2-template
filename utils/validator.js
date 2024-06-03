const validator = require('validator');

class Validator {
    constructor(formData = {}, validationRules = {}) {
        this.formData = formData;
        this.validationRules = validationRules;
    }

    and() {
        for (const field in this.validationRules) {
            if (this.validationRules.hasOwnProperty(field)) {
                const rules = this.validationRules[field];
                if (Array.isArray(rules) && rules?.length) {
                    for (let row of rules) {
                        const { name, message, params } = row;
                        if (name === 'required') {
                            if (global.isEmpty(this.formData[field])) {
                                return {
                                    valid: false,
                                    message,
                                }
                            }
                            continue;
                        }
                        if (validator[name]) {
                            if (!validator[name](this.formData[field], params)) {
                                return {
                                    valid: false,
                                    message
                                }
                            }
                        }
                    }
                }
            }
        }

        return {
            valid: true,
            message: 'success'
        }
    }

    or() {
        let valid = false;
        let msg = '';
        for (const field in this.validationRules) {
            const rules = this.validationRules[field];
            if (rules?.length) {
                for (const row of rules) {
                    const { name, message, params } = row;

                    if (!msg) msg = message;

                    if (name === 'required') {
                        if (!global.isEmpty(this.formData[field])) {
                            valid = true;
                            break;
                        }
                    }

                    if (validator[name]) {
                        if (validator[name](this.formData[field], params)) {
                            valid = true;
                            break;
                        }
                    }
                }
            }

            if (valid) break;
        }

        return {
            valid,
            message: valid ? 'success' : msg,
        };
    }
}

module.exports = Validator;