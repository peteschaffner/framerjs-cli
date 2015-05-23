#!/usr/bin/env node

/**
 * Module dependencies.
 */

var babelify = require('babelify');
var browserify = require('browserify');
var chokidar = require('chokidar');
var coffeeify = require('coffeeify');
var colors = require('colors/safe');
var connect = require('connect');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var livereload = require('connect-livereload');
var livereloadServer = require('tiny-lr');
var path = require('path');
var program = require('commander');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');
var through = require('through2');


program
  .description('Preview your project.')
  .arguments('[dir]')
  .option('-p, --port <port>', 'specify the port [3000]', Number, 3000)
  .parse(process.argv);

var directory = path.resolve(program.args[0] || '.');
var projectType = require('../lib/framer_test.js')(directory);

if (!projectType) {
  console.warn(colors.red('Error: ') + 'not a "framer-cli" project');
  process.exit(1);
}

// move into [dir]
process.chdir(directory);

// setup the server
var server = connect();

// watch files
chokidar
  .watch(directory, { ignored: /node_modules|[\/\\]\./ })
  .on('all', function(event, file) {
    livereloadServer.changed(file);
  });

// inject livereload.js
server.use(livereload({ port: program.port }));

// browserify
var b = browserify({
  basedir: directory,
  debug: true,
  extensions: ['.coffee'],
  paths: [directory + '/modules']
});

b.transform(coffeeify, { global: true });
b.transform(babelify, { global: true });
b.transform(resolveAssetPaths, { global: true });
if (projectType === 'module') b.require('.'); else b.add('index.js');

// create build file for distribution
b.on('bundle', function(bundle) {
  var bundleFile = fs.createWriteStream(directory + '/.bundle.js');

  bundle.pipe(bundleFile);
});

// bundle on request
server.use(function (req, res, next) {
  if (req.url !== '/.bundle.js') return next();

  b.bundle()
    .on('error', function(err) {
      console.error(colors.red('\nError: ') + err.message);
      res.end('console.error("' + err.message + '")');
      this.emit('end');
    })
    .pipe(res);
});

// static files
server.use(serveStatic(directory));
server.use(serveIndex(directory));

// livereload server
server.use(livereloadServer.middleware({ app: server }));

// start the server
server.listen(program.port, function () {
  var htmlFile = (projectType === 'module') ? 'test.html' : '';

  console.log(
    colors.grey('%s running at ') + colors.cyan('http://localhost:%s/%s'),
    projectType.charAt(0).toUpperCase() + projectType.slice(1),
    program.port,
    htmlFile
  );

  exec('open "http://localhost:' + program.port + '/' + htmlFile + '"');
});


/**
 * A Browserify path transform so you can reference assets in your modules
 * without having to do this business: `__dirname + '/image.png'`
 */

function resolveAssetPaths(file) {
  var regex = /['"](.+\.(png|gif|jpeg|jpg|svg|mp4))['"]/ig;

  return through(function (buf, enc, next) {
    this.push(buf.toString('utf8').replace(regex, function (m, fpath) {
      var url = '\'' + path.relative(process.cwd(), path.dirname(file)) +
        '/' + fpath + '\'';

      return url.replace(/^'\//, '\'');
    }));
    next();
  });
}
