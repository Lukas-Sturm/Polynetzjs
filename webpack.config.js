var path = require('path');

module.exports = {
    entry: './src/polynetz.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'polynetz.js',
        publicPath: '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    }
                ]
            }
        ]
    }
};