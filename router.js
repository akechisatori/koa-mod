const route = require('koa-route');
const fs = require('fs');
const path = require('path');

const REGEX_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const REGEX_FUNCTION_PARAMS = /(?:\s*(?:function\s*[^(]*)?\s*)((?:[^'"]|(?:(?:(['"])(?:(?:.*?[^\\]\2)|\2))))*?)\s*(?=(?:=>)|{)/m
const REGEX_PARAMETERS_VALUES = /\s*(\w+)\s*(?:=\s*((?:(?:(['"])(?:\3|(?:.*?[^\\]\3)))((\s*\+\s*)(?:(?:(['"])(?:\6|(?:.*?[^\\]\6)))|(?:[\w$]*)))*)|.*?))?\s*(?:,|$)/gm


module.exports = {
    getParams: (func) => {
        let functionAsString = func.toString()
        let params = []
        let match
        let result = {}

        functionAsString = functionAsString.replace(REGEX_COMMENTS, '')
        functionAsString = functionAsString.match(REGEX_FUNCTION_PARAMS)[1]
        if (functionAsString.charAt(0) === '(') functionAsString = functionAsString.slice(1, -1)
        while (match = REGEX_PARAMETERS_VALUES.exec(functionAsString)) params.push([match[1], match[2]])

        params.forEach((value, index) => {
            var values = (value[1] !== undefined) ? value[1].replace(new RegExp(/\"|\'/g), "") : null;
            
            result[value[0]] = values;
            if (value[1] === 'null') {
                result[value[0]] = null;
            }
        });
        return result;
    },
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