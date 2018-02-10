var path = require('path');

module.exports = {
    entry: './src/entry.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'polynetz.js',
        publicPath: '/dist',
        library: 'Polynetz'
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