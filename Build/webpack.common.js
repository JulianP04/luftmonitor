const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  stats: 'errors-only',
  entry: {
    'app': './index.js'
  },
  output: {
    filename: 'JavaScripts/[name].js',
    path: path.resolve(__dirname, '../Public'),
  },
  module: {
    rules: [
        { // JavaScript compiler
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    sourceMap: true,
                    presets: ['@babel/preset-env']
                }
            },
        },
        {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader, // For Css Files
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                },
                { // Scss compiler
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                },
            ]
        },
        { // Images and Icons
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        outputPath: 'Images/',
                        publicPath: './Images/'
                    }
                }
            ]
        }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: './StyleSheets/[name].css'
    }),
    new CopyPlugin( // Copies all the assets like images, fonts, icons etc.
      {
          patterns: [
            {
              from: 'Assets/Images',
              to: 'Images'
            },
            {
              from: 'Assets/Icons',
              to: 'Icons'
            },
            {
              from: 'Assets/Icons',
              to: 'Icons'
            },
            {
              from: 'Assets/Fonts',
              to: 'Fonts'
            }
          ]
      }
    ),
    new WebpackBar(),
  ],
};