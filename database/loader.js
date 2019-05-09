const Sequelize = require('Sequelize');
const sequelize = require('./core/sequelize');
const fs = require('fs');
const path = require('path');

async function LoadModel() {
    return new Promise((resolve, reject) => {
        const Models = {};
        let files = fs.readdirSync(__dirname + '/models/');
        files.forEach(filestr => {
            const file = path.parse(filestr);
            if (file.ext === '.js') {
                const ModelObject = sequelize.import(`${__dirname}/models/${file.base}`);
                Models[file.name] = ModelObject;
            }
        });
        resolve(Models);
    });
}

LoadModel().then(Models => {
    Object.keys(Models).forEach((value, index) => {
        Models[value].sync({
            alter: true
        }).then(() => {
            console.log(`Table '${value}' Sync Complete`);
        });
    });
    module.exports = Models;
});