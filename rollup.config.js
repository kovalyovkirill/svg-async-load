const { nodeResolve } = require('@rollup/plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const url = require('postcss-url');
const postcss = require('rollup-plugin-postcss');
const copy = require('rollup-plugin-copy');
const del = require('rollup-plugin-delete');
const filesize = require('rollup-plugin-filesize');
const { terser } = require('rollup-plugin-terser');
const path = require('path');
const packageJson = require('./package.json');
const { visualizer } = require('rollup-plugin-visualizer');

const localIdent = require('./localIdent');
const format = 'es';

/**
 * @type {import('rollup').RollupOptions}
 */
const configBase = {
  input: 'src/index.ts',
  external: [...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.peerDependencies || {})],
  output: {
    dir: './dist',
    format,
    sourcemap: true,
  },
  plugins: [
    del({ targets: 'dist/*' }),
    nodeResolve({
      moduleDirectories: ['node_modules'],
    }),
    typescript({
      typescript: require('typescript'),
      tsconfigDefaults: {
        compilerOptions: {
          plugins: [
            { transform: 'typescript-transform-paths' },
            { transform: 'typescript-transform-paths', afterDeclarations: true },
          ],
        },
      },
    }),
    postcss({
      extensions: ['.css', '.scss'], // Поддержка CSS и SCSS
      modules: {
        generateScopedName: function (name, filename) {
          const file = path.basename(filename, '.scss');
          return localIdent.generateCssClassName(file, name);
        },
      },
      extract: path.resolve('dist/styles.css'), // Сбор всех стилей в один файл
      minimize: true,
      use: {
        sass: true,
      },
      plugins: [
        url({
          url: 'inline', // для svg иконок, чтобы не создавать лишние файлы
        }),
      ],
    }),
    terser(),
    copy({
      targets: [
        {
          src: ['src/styles'],
          dest: 'dist',
        },
      ],
    }),
    filesize(),
    process.env.ANALYZE === 'true' && visualizer(),
  ],
};

module.exports = [configBase];
