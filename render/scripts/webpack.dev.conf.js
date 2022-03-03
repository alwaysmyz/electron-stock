const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefresh = require("react-refresh/babel");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "eval",
  output: {
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  cache: {
    type: "filesystem",
  },

  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      edge: "17",
                      firefox: "60",
                      chrome: "67",
                      safari: "11.1",
                      ie: "11",
                    },
                    useBuiltIns: "entry",
                  },
                ],
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: [ReactRefresh],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new CaseSensitivePathsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./public/index.html"
    }),
  ],

  devServer: {
    host: "0.0.0.0", //10.36.206.202
    port: 3000,
    hot: true,
    open: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {},
    historyApiFallback: {
      rewrites: [
        { from: "/", to: "/index.html" },
      ],
    },
  },
});
