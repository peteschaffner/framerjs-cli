
/**
 * Module dependencies.
 */

var through = require('through2');
var path = require('path');

/**
 * A Browserify path transform so you can reference assets in your modules
 * without having to do this business: `__dirname + '/image.png'`
 */

module.exports = function (file) {
  var regex = /'(.+\.(png|gif|jpeg|jpg|svg|mp4))'/ig;

  return through(function (buf, enc, next) {
    this.push(buf.toString('utf8').replace(regex, function (m, fpath) {
      return '\'' + path.relative(__dirname, path.dirname(file)) +
        '/' + fpath + '\'';
    }));
    next();
  });
};
