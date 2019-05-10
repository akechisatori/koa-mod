const Koa = require('koa');
const config = require('./config');
const router = require('./router');
const watchdog = require('promise-timeout');
const onerror = require('koa-onerror');
const loader = require('./loader');
const sequelize = require('./database/core/sequelize');
const model = require('./database/loader');

const app = new Koa();
const loaded_extension = loader.load();

app.use((ctx, next) => {
    const start = new Date();
    return next().then(function() {
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
});

app.use((ctx, next) => new Promise(resolve => {
    router.bind(__dirname + config.root, ctx.request.path).then(invoke => {
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

        if (!Reflect.has(controller,method)) {
            throw {
                staus: 404,
                message: 'Method Not Found'
            }
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
        

        try {
            var reflect = Reflect.apply(controller[method], this_params, method_params);
            if (typeof reflect !== 'object') {
                ctx.body = {
                    status: 500,
                    message: 'Reflect Returns a non-Promise object'
                }
                return resolve();
            }
            reflect = reflect.then(res => {
                ctx.body = res;
            }).catch(err => {
                ctx.body = {
                    status: 500,
                    message: err.message,
                    stack: err.stack
                }
            }).finally(() => {
                resolve();
            });
        } catch (error) {
            ctx.body = {
                status: 500,
                message: err.message,
                stack: err.stack
            }
        }
        watchdog.timeout(reflect, config.max_runtime).then(() => {
            
        }).catch(err => {
            ctx.body = {
                status: 504,
                message: 'Controller Process Timeout'
            }
            resolve();
        });
    }).catch(err => {
        ctx.body = err;
        resolve();
    });
}));
onerror(app);

console.log("Listening Port: " + config.port);

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app.listen(config.port);