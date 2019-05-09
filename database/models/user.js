const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        name: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.STRING,
        job: Sequelize.STRING
    }, {
        freezeTableName: true
    })
}