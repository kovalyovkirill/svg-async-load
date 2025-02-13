const svgr = require('@svgr/rollup');
const { terser } = require('rollup-plugin-terser');

const { getIconFileNames, ICONS_FOLDER } = require('./getIconFileNames');

const config = {
  input: getIconFileNames().map((file) => `${ICONS_FOLDER}/${file}`),
  output: {
    dir: 'dist/icons',
    format: 'es',
  },
  external: ['react'],
  plugins: [
    svgr({
      index: false,
      icon: true,
      dimensions: false,
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              // Удаляем атрибуты fill и stroke из всех элементов
              attrs: '(stroke|fill)',
            },
          },
        ],
      },
      // Добавляем к корневому тегу <svg> атрибут fill="currentColor"
      svgProps: {
        fill: 'currentColor',
      },
    }),
    terser(),
  ],
};

module.exports = [config];
