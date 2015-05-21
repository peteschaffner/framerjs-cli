#!/usr/bin/env node

/**
 * Module dependencies.
 */

var colors = require('colors/safe');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var path = require('path');
var program = require('commander');

program
  .description('Create a project.')
  .arguments('[dir]')
  .option('-m, --module', 'create a module')
  .parse(process.argv);

var directory = path.resolve(program.args[0] || '.');
var projectType = require('../lib/framer_test.js')(directory);

// create [dir] if it doesn't exist
if (!projectType) fs.mkdirpSync(directory);

// scaffold project/module if [dir] is empty
if (!!!fs.readdirSync(directory).length) {
  var projectType = program.module ? 'module' : 'project';
  var toPath = '../node_modules/framer-' + projectType;

  console.log(colors.grey('Creating %s...'), projectType);
  fs.copySync(path.resolve(__dirname, toPath), directory);
  exec('framer update ' + directory);
} else console.warn(colors.red('Error: ') + directory + ' is not empty');

