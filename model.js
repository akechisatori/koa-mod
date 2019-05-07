const Sequelize = require('Sequelize');
const sequelize = require('./sequelize');

const Model = {
    user: sequelize.define('user', {
        name: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.STRING,
        job: Sequelize.STRING,
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        freezeTableName: true
    })
}
Object.keys(Model).forEach((value, index) => {
    Model[value].sync({
        alter: true
    }).then(() => {
        console.log(`Table '${value}' Sync Complete`);
    });
});

module.exports = Model;