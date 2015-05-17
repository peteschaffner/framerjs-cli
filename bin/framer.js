#!/usr/bin/env node

/**
 * Module dependencies.
 */

var babelify = require('babelify');
var browserify = require('browserify');
var chokidar = require('chokidar');
var coffeeify = require('coffeeify');
var connect = require('connect');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var livereload = require('connect-livereload');
var livereloadServer = require('tiny-lr');
var path = require('path');
var program = require('commander');
var request = require('sync-request');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
var through = require('through2');

program
  .version(require('../package.json').version)
  .description('A Framer.js CLI for quickly building modular prototypes.')
  .usage('[options] [dir]')
  .option('-p, --port <port>', 'specify the port [3000]', Number, 3000)
  .option('-m, --module', 'create and serve a module')
  .option('-u, --update', 'update Framer.js framework');

program.parse(process.argv);

// path
var dir = path.resolve(program.args[0] || '.');

// create [dir] if it doesn't exist
if (!fs.existsSync(dir)) fs.mkdirpSync(program.args[0]);

// move into [dir]
process.chdir(dir);

// Update Framer.js if we have a project
if (!!fs.readdirSync(dir).length && program.update) updateFramer();

// scaffold project/module if [dir] is empty
if (!!!fs.readdirSync(dir).length) {
  var projectType = program.module ? 'module' : 'project';
  var toPath = '../node_modules/framer-' + projectType;

  console.log('\033[90mCreating %s...', projectType);

  fs.copySync(path.resolve(__dirname, toPath), dir);
  updateFramer();
}

// setup the server
var server = connect();

// watch files
chokidar
  .watch(dir, { ignored: /node_modules|[\/\\]\./ })
  .on('all', function(event, file) {
    livereloadServer.changed(file);
  });

// inject livereload.js
server.use(livereload({ port: program.port }));

// browserify
var b = browserify({
  extensions: ['.coffee'],
  paths: [dir + '/modules'],
  basedir: dir
});

b.transform(coffeeify);
b.transform(babelify, { global: true });
b.transform(resolveAssetPaths, { global: true });
b.on('error', console.error);
if (program.module) b.require('./index.js'); else b.add('index.js');

// create build file for distribution
b.on('bundle', function(bundle) {
  var bundleFile = fs.createWriteStream(dir + '/.bundle.js');

  bundle.pipe(bundleFile);
});

// bundle on request
server.use(function (req, res, next) {
  if (req.url !== '/.bundle.js') return next();
  b.bundle().pipe(res);
});

// static files
server.use(serveStatic(dir));
server.use(serveIndex(dir));

// livereload server
server.use(livereloadServer.middleware({ app: server }));

// start the server
server.listen(program.port, function () {
  var projectType = program.module ? 'Module' : 'Prototype';
  var htmlFile = program.module ? 'test.html' : '';

  console.log(
    '\033[90m%s running at \033[36mhttp://localhost:%s/%s',
    projectType,
    program.port,
    htmlFile
  );

  exec('open "http://localhost:' + program.port + '/' + htmlFile + '"');
});



/**
 * Update local version of Framer framework and source map
 */

function updateFramer() {
  if (program.module) return;

  console.log('\033[90mUpdating Framer.js...');

  ['framer.js', 'framer.js.map'].forEach(function(file) {
    var res = request('GET', 'http://builds.framerjs.com/latest/' + file);

    fs.writeFileSync(dir + '/.framer/' + file, res.getBody());
  });
}

/**
 * A Browserify path transform so you can reference assets in your modules
 * without having to do this business: `__dirname + '/image.png'`
 */

function resolveAssetPaths(file) {
  var regex = /['"](.+\.(png|gif|jpeg|jpg|svg|mp4))['"]/ig;

  return through(function (buf, enc, next) {
    this.push(buf.toString('utf8').replace(regex, function (m, fpath) {
      return '\'' + path.relative(process.cwd(), path.dirname(file)) +
        '/' + fpath + '\'';
    }));
    next();
  });
}