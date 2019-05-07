module.exports = {
    dev: true,
    port: 3000,
    root: "/controller",
    auto_params: true,
    strict_function_params: false,
    max_runtime: 5000, //ms
    mysql: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        pass: 'satori2333',
        database: 'neko',
    }
}