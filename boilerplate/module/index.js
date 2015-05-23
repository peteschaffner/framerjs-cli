
var UILabel = require('framer-uilabel')

module.exports = class RainbowLabel extends UILabel {
  constructor(opts={}) {
    super(opts);

    this.style.background = `linear-gradient(
        to right,
        red,
        orange,
        yellow,
        green,
        blue,
        indigo,
        violet
      )`;
  }
}
