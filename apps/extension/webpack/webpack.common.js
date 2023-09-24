const webpack = require('webpack')
const dotenv = require('dotenv');
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const srcDir = path.join(__dirname, '..', 'src')

module.exports = () => {
  const env = dotenv.config().parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: {
      popup: path.join(srcDir, 'popup'),
      options: path.join(srcDir, 'options'),
      background: path.join(srcDir, 'background'),
      content: path.join(srcDir, 'content'),
    },
    output: {
      path: path.join(__dirname, '../dist/js'),
      filename: '[name].js',
    },
    optimization: {
      splitChunks: {
        name: 'vendor',
        chunks(chunk) {
          return chunk.name !== 'background'
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: '.', to: '../', context: 'public' }],
        options: {},
      }),
      new webpack.DefinePlugin(envKeys),
    ],
  }
}
