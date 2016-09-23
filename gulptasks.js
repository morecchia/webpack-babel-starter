import webpack from 'webpack';
import chalk from 'chalk';
import {create as createServerConfig} from './webpack.server';
import {create as createClientConfig} from './webpack.client';

const $ = require('gulp-load-plugins')();

module.exports = {
  prodServerBuild: prodServerBuild,
  prodClientBuild: prodClientBuild,
  devServerBuild: devServerBuild,
  devServerWatch: devServerWatch,
  devServerReload: devServerReload
};

// Client Tasks
function prodClientBuild(cb) {
  runWebpack('Prod:client',
    { isDev: false, config: createClientConfig }, cb);
}

// Server Tasks
function devServerBuild(cb) {
  runWebpack('Dev:server',
    { isDev: true, config: createServerConfig }, cb);
}

function prodServerBuild(cb) {
  runWebpack('Prod:server',
    { isDev: false, config: createServerConfig }, cb);
}

function devServerWatch() {
  webpack(createServerConfig(true)).watch({}, (error, stats) => {
    outputWebpack('Dev:server', error, stats);
  });
}

function devServerReload() {
  return $.nodemon({
    script: './build/server.js',
    watch: './build',
    env: {
      'NODE_ENV': 'development',
      'USE_WEBPACK': 'true'
    }
  });
}

// Helpers

function runWebpack(label, options, cb) {
  return webpack(options.config(options.isDev)).run((err, stats) => {
    outputWebpack(label, err, stats);
    cb();
  });
}

function outputWebpack(label, error, stats) {
  if (error)
    throw new Error(error);

  if (stats.hasErrors()) {
    $.util.log(stats.toString({ colors: true }));
  } else {
    const time = stats.endTime - stats.startTime;
    $.util.log(chalk.bgGreen(`Built ${label} in ${time} ms`));
  }
}