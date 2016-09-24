import 'source-map-support/register';
import express from 'express';
import http from 'http';
import chalk from 'chalk';

// ------------------------------
// Setup
const app = express(),
  server = http.Server(app),
  isDevelopment = process.env.NODE_ENV !== 'production';

// ------------------------------
// Client Webpack
if (process.env.USE_WEBPACK === 'true') {
  const webpackMiddleware = require('webpack-dev-middleware'),
    webpackHotmiddleware = require('webpack-hot-middleware'),
    webpack = require('webpack'),
    clientConfig = require('../../webpack.client'),
    compiler = webpack(clientConfig);
  
  app.use(webpackMiddleware(compiler, {
    publicPath: '/build/',
    stats: {
      colors: true,
      chunks: false,
      assets: false,
      timings: false,
      hash: false,
      version: false
    }
  }));

  app.use(webpackHotmiddleware(compiler));
  console.log(chalk.bgRed('Using Webpack DEV Middleware!!!  THIS IS FOR DEVELOPMENT ONLY!!!'));
}

// ------------------------------
// Configure Express
app.set('view engine', 'jade');
app.use(express.static('public'));

const useExternalStyles = !isDevelopment;
app.get('/', (req,res) => {
  res.render('index', {
    useExternalStyles
  });
});

// ------------------------------
// Modules

// ------------------------------
// Startup
const port = process.env.NODE_ENV.port || 3000;
function startServer() {
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

startServer();