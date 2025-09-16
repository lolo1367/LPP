const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx', // On pointe sur index.tsx (React + TS)
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json'], // Résoudre ces extensions
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Support TypeScript + TSX (React)
        exclude: /node_modules/,
        use: 'ts-loader', // On utilise ts-loader pour compiler TS
      },
      { 
        test: /\.js$/, // Babel pour les js classiques
        exclude: /node_modules/,
        use: 'babel-loader',
      },
  // CSS Modules : *.module.css
  {
    test: /\.module\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true, // Active les CSS Modules
        },
      },
      'postcss-loader',
    ],
      },
    {
      test: /\.css$/,
    exclude: /\.module\.css$/, // Important !
    use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new Dotenv({
      path: './.env.production', // explicitement le fichier de prod
      systemvars: true,           // pour prendre aussi les variables définies dans Render
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true, // utile pour React Router (SPA)
  },
  mode: 'development',
};
