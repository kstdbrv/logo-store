const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')


const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pages/`
const FOLDERS = fs.readdirSync(PAGES_DIR)
let pages = []
for(let folder of FOLDERS) pages.push(fs.readdirSync(`${PAGES_DIR}/${folder}`).filter(fileneme => fileneme.endsWith('.pug')))
pages = pages.flat()

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: ['@babel/polyfill', PATHS.src],
  },
  output: {
    filename: `${PATHS.assets}js/[name].[chunkhash].js`,
    path: PATHS.dist
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
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: `${PATHS.assets}fonts`,
        publicPath: `${PATHS.assets}fonts`
        /* publicPath: (pathFromRoot) => `${PATHS.assets}fonts/${pathFromRoot}` */
    }
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: `${PATHS.assets}images`,
        publicPath: `${PATHS.assets}images`
        /* publicPath: (pathFromRoot) => `${PATHS.assets}images/${pathFromRoot}` */
    }
    },
    {
      test: /\.s[ac]ss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true }
        }
      ]
    },]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/static`, to: '' }, 
      ],
    }),
    ...pages.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page.replace(/\.[^.]+$/, '')}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    }))
  ],
}