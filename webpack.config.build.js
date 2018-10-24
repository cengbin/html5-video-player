const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/VideoPlayer.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'videoplayer.js',
    library: "dk",
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname,'src')]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader',"sass-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100
        }
      }
    ]
  }
};