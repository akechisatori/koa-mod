const path = require('path');
const fs = require('fs');

module.exports = {
    load(extension_dir = __dirname + '/extend') {
        try {
            var object = {};
            var files = fs.readdirSync(extension_dir);

            files.forEach((value, index) => {
                let folder = path.join(extension_dir, value);
                var stats = fs.statSync(folder);

                if (stats.isDirectory()) {
                    let core_js_path = folder + '/index.js';
                    let core_exists = fs.statSync(core_js_path);
                    if (core_exists) {
                        object[value] = require(core_js_path);
                    }
                }
            });
            return object;
        } catch (error) {
            console.log(error);
        }
    }
}