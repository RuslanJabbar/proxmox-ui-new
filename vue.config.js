// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api2': {
        target: 'https://172.20.7.100:8006',
        changeOrigin: true,
        secure: false, // Important for self-signed certificates
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        onProxyReq: function(proxyReq, req, res) {
          // Forward cookies from the client
          if (req.headers.cookie) {
            proxyReq.setHeader('Cookie', req.headers.cookie);
          }
          // Forward auth headers
          if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
          }
          if (req.headers.csrfpreventiontoken) {
            proxyReq.setHeader('CSRFPreventionToken', req.headers.csrfpreventiontoken);
          }
        },
        onProxyRes: function(proxyRes, req, res) {
          // Add CORS headers to the response
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, CSRFPreventionToken';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        }
      }
    }
  }
}