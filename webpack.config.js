const path = require("path");

module.exports = {
entry: {
app: "./source/app.js"
},
devtool: "inline-source-map",
output: {
filename: "[name].bundle.js",
path: path.resolve(__dirname, "dist")
}
};