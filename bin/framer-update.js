#!/usr/bin/env node

/**
 * Module dependencies.
 */

var colors = require('colors/safe');
var fs = require('fs-extra');
var path = require('path');
var program = require('commander');
var request = require('sync-request');

program
  .description('Update Framer.js framework.')
  .arguments('[dir]')
  .parse(process.argv);

var directory = path.resolve(program.args[0] || '.');
var projectType = require('../lib/framer_test.js')(directory);

if (!projectType || projectType === 'module') return;

console.log(colors.grey('Updating Framer.js...'));

['framer.js', 'framer.js.map'].forEach(function(file) {
  var res = request('GET', 'http://builds.framerjs.com/latest/' + file);

  fs.writeFileSync(directory + '/.framer/' + file, res.getBody());
});
