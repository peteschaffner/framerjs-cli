#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version(require('../package.json').version)
  .description('A Framer.js CLI for quickly building modular prototypes.')
  .command('new [dir]', 'create a project')
  .command('preview [dir]', 'preview a project')
  .command('update [dir]', 'update Framer.js framework')
  .parse(process.argv);

