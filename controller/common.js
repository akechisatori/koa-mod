const axios = require('axios');

module.exports = {
    query: function() {
        return new Promise((resolve, reject) => {
            this.db.user.findAll({
                where: {
                  id: 1
                }
              }).then(res => {
                  resolve(res);
              });
        });
    },
    db: function(name = 'Yajuu Senpai', age = 24, job = 'がくせい', weight = '74kg') {
        return new Promise((resolve, reject) => {
            this.db.user.create({
                name, age, job, weight
            }).then(res => {
                resolve(res);
            })
        })
    },
    test: function(word, from = 'cn', to = 'jp') {
        return new Promise((resolve, reject) => {
            this.ext.hujiang.search(word, from, to).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        });
    },
    ip: function(ip = '') {
        return new Promise((resolve, reject) => {
            axios.get('https://api.ip.sb/geoip/' + ip).then(res => {
                resolve(res.data);
                this.next().then(() => {
                    setTimeout(() => {
                        console.log("next() method test");
                    }, 2000);
                });
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
        });
    }
}