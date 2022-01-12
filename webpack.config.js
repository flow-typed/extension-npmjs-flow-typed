const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/background.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'background.js',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
};
