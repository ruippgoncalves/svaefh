const DotenvPlugin = require('webpack-dotenv-plugin');

module.exports = {
    entry: './app.js',
    mode: 'development',
    target: 'node',
    output: {
        filename: 'server.min.js'
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new DotenvPlugin({
            sample: './config/config.example.env',
            path: './config/config.env'
        })
    ],
    optimization: {
        minimize: true
    }
}
