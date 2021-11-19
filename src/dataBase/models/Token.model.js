const Sequelize = require('sequelize');
const { sequelize } = require('..');
const User = require('./User.model');

class Token extends Sequelize.Model {}

Token.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        value: {
            type: Sequelize.STRING,
            defaultValue: 'Value',
        },
    },
    { sequelize: sequelize, underscored: true, modelName: 'token' }
);


module.exports = Token