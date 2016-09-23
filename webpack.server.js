const path = require('path'),
  fs = require('fs'),
  webpack = require('webpack'),
  nodeModules = fs.readdirSync('./node_modules').filter(d => d != '.bin');

module.exports = createConfig(true);
module.exports.create = createConfig;

function createConfig(isDebug) {
  const plugins = [];
  
  if(!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  // Webpack Config
  return {
    target: 'node',
    devtool: 'source-map',
    entry: './src/server/server.js',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'server.js'
    },
    resolve: {
      alias: {
        shared: path.join(__dirname, 'src', 'shared')
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel', exclude: '/node_modules/' },
        { test: /\.js$/, loader: 'eslint-loader', exclude: '/node_modules/' }
      ]
    },
    externals: [ignoreNodeModules],
    plugins: plugins
  };
}

function ignoreNodeModules(ctx, req, cb) {
  // ignore relative paths
  if (req[0] === '.')
    return cb();
  // get the module name
  const module = req.split('/')[0];
  // if the module exists, append to commonjs
  if (nodeModules.indexOf(module) > -1) {
    return cb(null, `commonjs ${req}`);
  }
  return cb();
}