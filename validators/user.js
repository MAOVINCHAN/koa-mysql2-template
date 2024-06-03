module.exports = {
    registerRules: {
        username: [
            { name: 'required', message: 'The username is required!' },
            { name: 'isLength', message: 'The username must be at least 6 characters and at most 22 characters.', params: { min: 6, max: 22 } },
        ],
        password: [
            { name: 'required', message: 'The password is required!' },
            { name: 'isLength', message: 'The password must be at least 6 characters and at most 22 characters.', params: { min: 6, max: 22 } }
        ],
        email: [
            { name: 'required', message: 'The email is required!' },
            { name: 'isEmail', message: 'Please check your email address.' }
        ]
    },
    findUserRules: {
        username: [
            { name: 'required', message: 'Please check your id or username or email in the parameters.' },
        ],
        email: [
            { name: 'required', message: 'Please check your id or username or email in the parameters.' },
        ],
    },
    findByIdRules: {
        id: [
            { name: 'required', message: 'The id is required!' },
        ]
    }
}