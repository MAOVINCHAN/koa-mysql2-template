const { User, updatableColumn, stateNormal } = require('@models/user');
const { Op } = require('sequelize');
const { comparePasswords } = require('@utils/hash');
const { SECRET_LEVEL, FUZZY_SYMBOL, FUZZY_QUERY_KEY, SHOW_TIME_LEVEL } = require('@core/constants');

class UserDAO {
    static async create(body = {}) {
        const { email, username } = body
        const hasUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (hasUser) {
            throw new global.errors.Existing(global.__('userOrEmailExist'));
        }

        const newUser = await User.create(body)

        const data = {
            email: newUser.email,
            username: newUser.username
        }

        return data;
    }

    static async verify(body = {}) {
        const { username, email, password } = body;
        const condition = [username ? { username } : { email }];

        const user = await User.findOne({
            where: {
                [Op.and]: condition
            }
        })

        if (!user) {
            throw new global.errors.AuthFailed(global.__('emptyAccount'));
        }

        if (!password) {
            throw new global.errors.AuthFailed(global.__('checkFail'));
        }

        const checkPass = comparePasswords(password, user.password);

        if (!checkPass) {
            throw new global.errors.AuthFailed(global.__('checkFail'));
        }

        if (user.state != stateNormal) {
            throw new global.errors.Forbidden(global.__('stateException'));
        }

        await this.update(user.id, { last_login: new Date() });

        return user;
    }

    static async details(id, all) {
        const UserModel = all ? User : User.scope(SECRET_LEVEL);

        const user = await UserModel.findOne({
            where: {
                id
            }
        })

        if (!user) {
            throw new global.errors.AuthFailed(global.__('userDetailFailed'))
        }

        return user;
    }

    static async destroy(id) {
        const user = await User.findByPk(id);

        if (!user) {
            throw new global.errors.NotFound(global.__('NotFoundUser'));
        }

        return await user.destroy();
    }

    static async update(id, data = {}) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new global.errors.NotFound(global.__('NotFoundUser'));
        }

        const dataKeys = Object.keys(data);

        if (dataKeys.some(k => !updatableColumn.includes(k))) {
            const allKeys = updatableColumn.join(',');
            throw new global.errors.ParameterException(
                global.__('paramsError') + ` Only allow: ${allKeys.join(',')}`
            )
        }

        for (let key in data) {
            if (!global.isEmpty(data[key])) {
                user[key] = data[key]
            }
        }

        const newUser = await user.save({ fields: updatableColumn });

        return newUser;
    }

    static async list(query = {}) {
        const queryKeys = Object.keys(query);
        const aboutPage = ['page', 'limit'];
        const aboutColumn = ['id'].concat(updatableColumn).filter(k => k !== 'password');
        const allowKeys = aboutColumn.concat(aboutPage);

        const condition = {};
        if (queryKeys?.length) {
            const someMistake = queryKeys.some(key => {
                if (key.includes(FUZZY_QUERY_KEY)) key = key.split(FUZZY_SYMBOL)[0];
                return !allowKeys.includes(key);
            });

            if (someMistake) {
                throw new global.errors.ParameterException(
                    global.__('paramsError') + ` Only allow: ${allowKeys.join(',')} or xxx` + FUZZY_QUERY_KEY
                )
            }

            queryKeys.forEach(key => {
                if (aboutColumn.includes(key)) {
                    condition[key] = query[key];
                } else if (key.includes(FUZZY_QUERY_KEY)) {
                    const originKey = key.split(FUZZY_SYMBOL)[0];
                    condition[originKey] = {
                        [Op.like]: `%${query[key]}%`
                    }
                }
            })
        }

        let { page, limit } = query;
        if (limit) limit = Number(limit);
        if (page) page = Number(page);

        const total = await User.count();

        const users = await User.scope(SHOW_TIME_LEVEL).findAndCountAll({
            where: condition,
            limit,
            offset: (page - 1) * limit || 0,
        })

        return {
            data: users.rows,
            count: users.count,
            total,
        };
    }

}

module.exports = UserDAO;