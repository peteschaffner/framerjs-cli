#!/usr/bin/env node

/**
 * Module dependencies.
 */

var babelify = require('babelify');
var budo = require('budo');
var coffeeify = require('coffeeify');
var framerify = require('framerify');
var fs = require('fs-extra');
var path = require('path');
var program = require('commander');
var request = require('sync-request');
var resolve = require('path').resolve;

program
  .version(require('../package.json').version)
  .description('A Framer.js CLI for quickly building modular prototypes.')
  .usage('[options] [dir]')
  .option('-p, --port <port>', 'specify the port [3000]', Number, 3000)
  // .option('-L, --no-logs', 'disable request logs') TODO: use garnish
  .option('-m, --module', 'create and serve a module')
  .option('-u, --update', 'update Framer.js framework');

program.parse(process.argv);

// path
var dir = resolve(program.args[0] || '.');

// create [dir] if it doesn't exist
if (!fs.existsSync(dir)) fs.mkdirpSync(program.args[0]);

// move into [dir]
process.chdir(dir);

// Update Framer.js if we have a project
if (!!fs.readdirSync(dir).length && program.update) updateFramer();

// scaffold project/module if [dir] is empty
if (!!!fs.readdirSync(dir).length) {
  var toPath = '../node_modules/framer-';
  toPath += program.module ? 'module' : 'project';

  fs.copySync(path.resolve(__dirname, toPath), dir);
  updateFramer();
}

// set additional module lookup
process.env['NODE_PATH'] = dir + '/modules';

// start dev server
var server = budo(dir + '/index.js:.bundle.js', {
  dir: dir,
  live: true,
  port: program.port,
  // stream: program.logs ? process.stdout : false, // TODO: use `garnish`
  transform: [framerify, coffeeify, babelify],
  require: program.module ? './index.js' : null,
  extensions: ['.coffee']
});

// log url
server.on('connect', function(event) {
  var htmlFile = program.module ? 'test.html' : '';

  console.log('Prototype running at %s%s', event.uri, htmlFile);
})

// Create build file for distribution
server.on('update', function(url, src) {
  fs.writeFileSync(dir + '/' + url, src);
});

function updateFramer() {
  if (program.module) return;

  console.log('Updating Framer.js...');

  ['framer.js', 'framer.js.map'].forEach(function(file) {
    var res = request('GET', 'http://builds.framerjs.com/latest/' + file);

    fs.writeFileSync(dir + '/.framer/' + file, res.getBody());
  });
}
