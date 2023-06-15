const { createProxyMiddleware } = require('http-proxy-middleware');

console.log("Setting up proxy");
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:2252',
            changeOrigin: true,
        })
    );
};