const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
}

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: ['@babel/polyfill', PATHS.src],
  },
  output: {
    filename: `js/[name].[chunkhash].js`,
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
    {
      test: require.resolve('jquery'),
      loader: 'expose-loader',
      options: {
        exposes: ['$', 'jQuery'],
      }
    },
    {
      test: /\.pug$/,
      use: ['pug-loader']
    },
    {
      test: /\.js$/,
      exclude: '/node_modules/',
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          {
            'plugins': ['@babel/plugin-proposal-class-properties'
            ]
          }]
      }
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
      name: '[name].[ext]'
    }
    },
    {
      test: /\.(png|jpg|gif|svg)$/, 
      loader: 'file-loader',
      options: {
        name: 'images/[name].[ext]', /* css */
    }
    },
    {
      test: /\.s[ac]ss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true }
        }, 
      ]
      },
      {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
        }
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/images`, to: 'images' },
        { from: `${PATHS.src}/fonts`, to: 'fonts' },
        { from: `${PATHS.src}/static`, to: '' }, 
      ],
    }),
    new HtmlWebpackPlugin({
      hash: true,
      minify: true,
      template: `${PATHS.src}/index.html`,
      filename: './index.html'
    })
  ],
}