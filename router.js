const route = require('koa-route');
const fs = require('fs');
const path = require('path');

module.exports = {
    bind: (root, req_path) => {
        return new Promise((resolve, reject) => {
            let parsed = path.parse(req_path);
            if (parsed.dir === '/') {
                return reject({
                    status: 404,
                    message: `Controller Not Found`
                });
            }
            let controller = root + parsed.dir + ".js";
            try {
                if (fs.statSync(controller).isFile()) {
                    resolve({
                        controller: require(controller),
                        method: parsed.base
                    });
                }
            } catch (error) {
                reject({
                    status: 404,
                    message: `Controller Not Found`
                });
            }
        })
    }
}