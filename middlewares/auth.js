const { AUTH_USER, AUTH_ADMIN, AUTH_SUPER, COOKIE_USER_INFO } = require('@core/constants');
const { resolveToken } = require('@utils/token');

class Auth {
    constructor(allowLevel) {
        this.level = allowLevel || 1;

        Auth.USER = AUTH_USER;
        Auth.ADMIN = AUTH_ADMIN;
        Auth.SPUSER_ADMIN = AUTH_SUPER;
    }

    get verify() {
        return async (ctx, next) => {
            const { cookies } = ctx;
            const token = cookies.get(COOKIE_USER_INFO);

            let errMsg = global.__('invalidToken');

            if (!token) {
                errMsg = global.__('cannotEmptyToken');
                throw new global.errors.AuthFailed(errMsg);
            }

            try {
                var decode = resolveToken(token);
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    errMsg = global.__('tokenExpired')
                }

                throw new global.errors.AuthFailed(errMsg);
            }

            if (Number(decode.role) < Number(this.level)) {
                errMsg = global.__('authDenied')
                throw new global.errors.Forbidden(errMsg);
            }

            ctx.auth = {
                id: decode.id,
                role: decode.role
            }

            // allow next.
            await next()
        }
    }

}

module.exports = Auth;
