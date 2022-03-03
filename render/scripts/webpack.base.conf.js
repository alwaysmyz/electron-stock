const path = require("path");
const resolve = (dir) => path.resolve(__dirname, "../", dir);
module.exports = {
  entry: './src/index.js',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader",{
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    //浏览器兼容性
                    plugins: [require('postcss-preset-env')()]
                }
            }
        }],
      },
      {
        test: /\.(sc|sa)ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader",{
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    //浏览器兼容性
                    plugins: [require('postcss-preset-env')()]
                }
            }
        }],
      },
      {
        test: /\.(gif|jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
  optimization: {
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".tsx", ".ts", ".js", ".css", ".json", ".string", ".tpl"],
    alias: {
      "@img": resolve("src/img"),
    },
  },
};
