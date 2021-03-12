const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  cache: true,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /.html$/i,
        use: 'html-loader',
      },
      {
        test: /.scss$/,
        use: [
            'raw-loader',
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                       includePaths: [path.resolve(__dirname, 'node_modules')],
                    }
                }
            }
        ]
      },
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
    ]
  },
  resolve: {
    modules: [
      "node_modules",
    ],
    extensions: [
      '.ts',
      '.js'
    ]
  }
};

if (process.env.NODE_ENV !== 'production') {
  module.exports.devtool = 'eval';
}
