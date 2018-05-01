const path = require("path");
const webpack = require('webpack');

module.exports = {
mode: "production",
entry: {
app: "./source/app.js"
},
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
      ],
devtool: "inline-source-map",
output: {
filename: "[name].bundle.js",
path: path.resolve(__dirname, "dist")
}
};