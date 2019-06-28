const Koa = require('koa');
const config = require('./config');
const router = require('./router');
const watchdog = require('promise-timeout');
const onerror = require('koa-onerror');
const loader = require('./loader');
var sequelize, model;
if (config.mysql) {
    sequelize = require('./database/core/sequelize');
    model = require('./database/loader');
}
const bodyParser = require('koa-bodyparser');
const dotenv = require('dotenv');

const app = new Koa();
const loaded_extension = loader.load();

dotenv.config();
app.use(bodyParser());
app.use((ctx, next) => {
    const start = new Date();
    return next().then(function () {
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
});

app.use((ctx, next) => new Promise(async (resolve, reject) => {
    const invoke = await router.bind(__dirname + config.root, ctx.request.path).catch(err => {
        return reject(err);
    })
    if (invoke === undefined) {
        return reject({
            status: 500,
            message: 'Fail to load Controller'
        });
    }
    var controller = invoke['controller'];
    var method = invoke['method'];
    var method_params = [];

    var this_params = {
        ctx: ctx,
        next: next,
        ext: loaded_extension,
        db: model,
        mysql: sequelize
    }

    ctx.query = Object.assign(ctx.query, ctx.request.body);

    if (!Reflect.has(controller, method)) {
        return reject({
            status: 404,
            message: 'Method Not Found',
            method
        })
    }
    if (config.auto_params) {
        var _method_params = router.getParams(controller[method]);
        var method_keys = Object.keys(_method_params);
        var request_keys = Object.keys(ctx.query);

        method_keys.forEach((value, index) => {
            if (request_keys.indexOf(value) >= 0) {
                method_params.push(ctx.query[value]);
            } else {
                if (_method_params[value] !== null) {
                    method_params.push(_method_params[value]);
                } else {
                    if (config.strict_function_params) {
                        throw {
                            staus: 403,
                            message: `Params '${value}' Required`
                        };
                    } else {
                        method_params.push(null);
                    }
                }
            }
        });
    }

    var reflect = Reflect.apply(controller[method], this_params, method_params).then(res => {
        return resolve(res);
    }).catch(err => {
        return reject(err);
    });
    watchdog.timeout(reflect, config.max_runtime).catch(err => {
        return reject({
            status: 504,
            message: 'Controller Process Timeout',
            method
        });
    });
}).then(res => {
    ctx.body = res;
}).catch(err => {
    console.log(err)
    let error_body = {
        status: (err.status !== undefined) ? err.status : 500,
        message: err.message,
    }
    let keys = ['stack', 'method', 'path'];
    keys.map(key => {
        if (err[key] !== undefined) {
            error_body[key] = err[key]
        }
    })
    ctx.body = error_body
}));
onerror(app);

console.log("Listening Port: " + config.port);

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app.listen(config.port);