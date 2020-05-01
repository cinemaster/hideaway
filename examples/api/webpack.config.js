const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: { extensions: ['.js', '.jsx'] },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: ({ htmlWebpackPlugin }) => `
  <html>
    <head>
      <title>API Example</title>
    </head>
    <body>
    <div id="root"></div>
    </body>
  </html>`,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    hot: true,
    inline: true,
    publicPath: '/',
  },
};
