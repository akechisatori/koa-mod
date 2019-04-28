const axios = require('axios');

module.exports = {
    test: function(neko,str = 'owo', id) {
        return new Promise((resolve, reject) => {
            resolve({
                neko,
                str,
                id
            });
        })
    },
    ip: function(ip) {
        return new Promise((resolve, reject) => {
            axios.get('https://api.ip.sb/geoip' + (ip !== null ? ('/' + ip) : '')).then(res => {
                resolve(res.data);
                this.next().then(() => {
                    setTimeout(() => {
                        console.log("next() method test");
                    }, 2000);
                })
            }).catch(err => {
                reject(err);
            });
        });
    },
    timeout: function() {
        return new Promise((resolve, reject) => {
            //it will trigger 503 error
            setTimeout(() => {
                // resolve();
            }, 6000);
        })
    }
}