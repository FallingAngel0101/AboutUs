const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
                auto: true, // Добавлено для лучшей поддержки CSS модулей
              },
              importLoaders: 1, // Добавлено
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/, // Важно исключить модули
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: 'index.html',
    }),
  ],
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3001,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  
  stats: 'errors-warnings',
};