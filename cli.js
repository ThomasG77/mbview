#!/usr/bin/env node

/* eslint-disable no-console */
'use strict';

const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['n', 'quiet', 'q']
});
const open = require('open');
const fs = require('fs');
const utils = require('./utils');

const mbtiles = argv._;

if (argv.version || argv.v) {
  console.log(utils.version());
  process.exit(0);
} else if (!mbtiles.length) {
  console.log(utils.usage());
  process.exit(1);
}

try {
  mbtiles.forEach((f) => { fs.statSync(f).isFile(); });
} catch (e) {
  return console.error(e);
}

const MBView = require('./mbview');

const params = {
  center: argv.center || [-122.42, 37.75],
  mbtiles: mbtiles,
  port: argv.port || 3000,
  host: argv.host || 'localhost',
  zoom: 12,
  quiet: argv.q || argv.quiet,
  urltiles: argv.urltiles || 'http://tile.openstreetmap.org/{z}/{x}/{y}.png'
};

MBView.serve(params, (err, config) => {
  console.log('Listening on ' + config.host + ':' + config.port);
  if (!argv.n) open(config.host + ':' + config.port);
});
