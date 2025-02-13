const path = require('path');
const loaderUtils = require('loader-utils');
const localIdent = require('./localIdent');
const { parse } = require('react-docgen-typescript');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  title: `Библиотека компонентов`,
  defaultExample: true,
  propsParser: parse,
  sections: [
    {
      name: 'Атомы',
      components: ['src/atoms/**/index.tsx'],
      sectionDepth: 1,
    },
  ],
  pagePerSection: true,
  webpackConfig: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          /** LIB_DEV Параметр который нужен для понимания в каком режиме мы нахожимся.
           * Небходимо условие для svg иконок и разделения какой вид файлов мы загружаем.
           *  В тестах и в режиме разработки нам необходимо загружать svg файлы, в этих вариантах
           *  отрабатывает svgr/webpack и моки соответственно. */
          LIB_DEV: 'true',
        },
      }),
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: false,
        cwd: process.cwd(),
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }), // подключаем плагин для создания CSS файла
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.ts|tsx$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
              },
            },
          ],
        },
        {
          test: /\.module\.scss$/i, // Для локальных стилей SCSS
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                    const cssFileName = loaderUtils.interpolateName(loaderContext, '[name]', options);
                    return localIdent.generateCssClassName(cssFileName, localName);
                  },
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.scss$/i, // Для глобальных стилей SCSS
          exclude: /\.module\.scss$/i, // Исключаем локальные стили
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.module\.css$/i, // Для локальных стилей CSS
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                    const cssFileName = loaderUtils.interpolateName(loaderContext, '[name]', options);
                    return localIdent.generateCssClassName(cssFileName, localName);
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.css$/i, // Для глобальных стилей CSS
          exclude: /\.module\.css$/i, // Исключаем локальные стили
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff2?|ttf|jpg|gif|png|eot)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 64000,
              },
            },
          ],
          dependency: { not: ['url'] },
        },
        {
          test: /\.svg$/i,
          use: [{ loader: '@svgr/webpack', options: { icon: true, removeDimensions: false } }],
        },
      ],
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, './src'),
      },
      fallback: {
        http: false,
        https: false,
        url: false,
      },
    },
  },
  require: [path.resolve(__dirname, 'styleguide.setup.js'), path.join(__dirname, 'src', 'styles', 'colors.css')],
};
