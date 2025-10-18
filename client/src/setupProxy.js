const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // /api 로 시작하는 요청을 5000으로 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
