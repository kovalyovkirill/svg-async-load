const fs = require('fs');
const ICONS_FOLDER = './src/atoms/Icon/icons';

module.exports = {
  getIconFileNames: () => {
    return fs.readdirSync(ICONS_FOLDER);
  },
  ICONS_FOLDER,
};
