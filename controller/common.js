const axios = require('axios')

module.exports = {
    ip: (ctx, query) => {
        return new Promise((resolve, reject) => {
            let ip = query.ip;
            axios.get('https://api.ip.sb/geoip' + (ip ? '/' + ip : '')).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            });
        });
    }
}