const axios = require('axios')

module.exports = {
    ip: () => {
        return new Promise((resolve, reject) => {
            axios.get('https://api.ip.sb/geoip').then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    }
}