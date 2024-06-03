const { DataTypes } = require('sequelize');
const db = require('@core/db');
const { hashPassword } = require('@utils/hash');
const dayjs = require('dayjs');
const { nanoid } = require('@utils/simple');

const genderEnum = ['male', 'female', 'other'];
const langEnum = ['en', 'zh-CN'];

const stateNormal = '1';
const stateError = '0';
const stateEnum = [stateError, stateNormal];
const roleEnum = ['8', '16', '32'];

const UserColumn = {
    username: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false,
        validate: {
            isAlphanumeric: true, // only allow number or A-z.
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone_number: {
        type: DataTypes.STRING(20),
        unique: true,
        validate: {
            isNumeric: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
            const hashValue = hashPassword(val);
            this.setDataValue('password', hashValue);
        }
    },
    first_name: {
        type: DataTypes.STRING(50),
    },
    last_name: {
        type: DataTypes.STRING(50),
    },
    role: {
        type: DataTypes.ENUM(roleEnum),
        default: '8',
        validate: {
            isIn: [roleEnum]
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return dayjs(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        },
        validate: {
            isDate: true,
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return dayjs(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        },
        validate: {
            isDate: true,
        }
    },
    last_login: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return dayjs(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        },
        validate: {
            isDate: true,
        }
    },
    state: {
        type: DataTypes.ENUM(stateEnum),
        default: '1',
        validate: {
            isIn: [stateEnum]
        }
    },
    avatar_url: {
        type: DataTypes.STRING,
        validate: {
            isURL: true,
        }
    },
    language_preference: {
        type: DataTypes.ENUM(langEnum),
        defaultValue: 'en',
        validate: {
            isIn: [langEnum]
        }
    },
    gender: {
        type: DataTypes.ENUM(genderEnum),
        default: 'other',
        validate: {
            isIn: [genderEnum]
        }
    },
    birthday: {
        type: DataTypes.DATE,
        validate: {
            isDate: true,
        }
    }
}

const User = db.define('user',
    {
        id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            unique: true,
            defaultValue() {
                return nanoid();
            }
        },
        ...UserColumn
    },
    {
        tableName: 'user',
    }
)

module.exports = {
    User,
    updatableColumn: Object.keys(UserColumn),
    stateNormal
};