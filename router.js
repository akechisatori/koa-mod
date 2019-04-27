const route = require('koa-route');
const fs = require('fs');

module.exports = {
    bind: (root, path) => {
        return new Promise((resolve, reject) => {
            let splited_path = path.split('/');
            let folder = splited_path.slice(0, splited_path.length - 1).join('/');
            let action = splited_path.slice(-2);
            let controller = root + folder + ".js";
            try {
                if (fs.statSync(controller).isFile()) {
                    resolve({
                        controller: require(controller),
                        method: action.pop()
                    });
                }
            } catch (error) {
                console.log(`stat ${controller} not exist`);
                reject({
                    status: 404,
                    message: `Controller Not Found`
                });
            }
        })
    }
}