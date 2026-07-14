import { Configuration, ProvidePlugin, WebpackPluginInstance } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ConfigWebpackPlugin from './scripts/ConfigWebpackPlugin';

const config: Configuration = {
  entry: { app: './src/index.tsx' },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx|mjs)$/i,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(c?js|mjs)$/i,
        include: /[\\/]node_modules[\\/]/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            plugins: [
              '@babel/plugin-transform-optional-chaining',
              '@babel/plugin-transform-nullish-coalescing-operator'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx']
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 10000,
      cacheGroups: {
        common: {
          chunks: 'all',
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true,
          enforce: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true,
          name(module) {
            const match = module.context?.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            );

            const packageName = match?.[1]?.replace('@', '');

            return `npm.${packageName}`;
          }
        }
      }
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true
    }),
    new ProvidePlugin({
      React: 'react'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }]
    }),
    new DotenvWebpackPlugin({
      defaults: true,
      allowEmptyValues: true,
      safe: true
    }),
    new ProgressBarPlugin() as WebpackPluginInstance,
    new ConfigWebpackPlugin({
      input: './src/config.ts',
      outputFileName: 'config.js'
    })
  ]
};

export default config;