const Sequelize = require('sequelize');
const config = require('./config');

var sequelize;

if (config.mysql) {
    sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.pass, {
        dialect: 'mysql',
        host: config.mysql.host,
        port: config.mysql.port,
        logging: (msg) => {
            if (config.dev === true || process.env.dev === "true") {
                console.log(`[MYSQL DEBUG]: ${msg}`);
            }
        }
    });
    sequelize.authenticate().then(() => {
        console.log("MySQL Server Connect established");
    }).catch(err => {
        console.error('Unable to connect to the MySQL Server', err);
        process.exit(1);
    })
} else {
    console.error("MySQL Config Not Found");
}
module.exports = sequelize;