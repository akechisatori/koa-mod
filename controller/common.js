const axios = require('axios')

module.exports = {
    ip: (ctx, query, next) => {
        return new Promise((resolve, reject) => {
            let ip = query.ip;
            axios.get('https://api.ip.sb/geoip' + (ip ? '/' + ip : '')).then(res => {
                resolve(res.data);
                next().then(() => {
                    setTimeout(() => {
                        console.log("next() method test")
                    }, 2000);
                })
            }).catch(err => {
                reject(err);
            });
        });
    }
}