const Koa = require('koa');
const config = require('./config');
const router = require('./router');
const watchdog = require('promise-timeout');
const onerror = require('koa-onerror');

const app = new Koa();

app.use((ctx, next) => {
    const start = new Date();
    return next().then(function() {
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
});

app.use(ctx => new Promise(resolve => {
    router.bind(__dirname + config.root, ctx.request.path).then(invoke => {
        var controller = invoke['controller'];
        var method = invoke['method'];
        var params = [ctx, ctx.query];

        if (!Reflect.has(controller,method)) {
            ctx.response.body = {
                staus: 404,
                message: "Method Not Found"
            };
            return;
        }
        var reflect = Reflect.apply(controller[method], undefined, params).then(res => {
            ctx.body = res;
        }).catch(err => {
            ctx.body = {
                status: 500,
                message: err.message,
                stack: err.stack
            };
        }).finally(() => {
            resolve();
        });
        watchdog.timeout(reflect, config.max_runtime).then(() => {
            
        }).catch(err => {
            ctx.body = {
                status: 503
            }
            resolve();
        });
    }).catch(err => {
        ctx.body = err;
        resolve();
    })
}));
onerror(app);

console.log("Listening Port: " + config.port);

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app.listen(config.port);