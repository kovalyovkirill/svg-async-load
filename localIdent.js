const startCase = require('lodash.startcase');

module.exports = {
  /**
   * Генерит имя css класса и для билда в rollup.config.js и для стайлгайда в styleguide.config.js
   */
  generateCssClassName: (fileName, cssSelectorLocalName) => {
    const name = startCase(fileName.replace('@', ' ')).replace(/-/g, ' ').replace(/ /g, '');

    // https://github.com/webpack-contrib/css-loader/blob/5e702e7d2e081b7f6d372f0c967fdfca6a40a584/src/utils.js#L37
    return `${name}__${cssSelectorLocalName}`
      .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
      .replace(/^((-?[0-9])|--)/, '_$1');
  },
};
