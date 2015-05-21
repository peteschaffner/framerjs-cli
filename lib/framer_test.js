
/**
 * Module dependencies.
 */

module.exports = function (dir) {
  try {
    return require(dir + '/package.json').framer.type;
  }
  catch (err) {
    return false;
  }
}
