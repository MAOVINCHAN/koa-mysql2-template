const { Sequelize } = require('sequelize');
const config = require('@root/config');
const logger = require('@root/utils/log')();
const { SECRET_LEVEL, SHOW_TIME_LEVEL } = require('./constants');
const { database, host, port, username, password } = config.database;

const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        scopes: {
            [SECRET_LEVEL]: {
                attributes: {
                    exclude: ['password', 'updated_at', 'deleted_at', 'created_at', 'last_login']
                }
            },
            [SHOW_TIME_LEVEL]: {
                attributes: {
                    exclude: ['password']
                }
            }
        }
    },
    logging: (message) => {
        logger.info({
            method: 'MYSQL',
            message
        })
    }
});

sequelize.sync({ force: false });

module.exports = sequelize;