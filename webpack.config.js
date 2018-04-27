const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: "./src/entry-server.js",
  mode: 'development',
  target: "node",
  output: {
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}