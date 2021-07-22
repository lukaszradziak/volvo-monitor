const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = () => {
  return {
    resolve: {
      alias: {
        components: path.resolve(__dirname, "src/components/"),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
      ],
    },
    devServer: {
      host: "0.0.0.0",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
      }),
    ],
  };
};
