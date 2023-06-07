const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'app.frontend': './src/app.frontend.js',
        'app.backend': './src/app.backend.js',
        'options': './src/pages/options.js'
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/app.frontend.css' },
                { from: './src/pages/options.html' }
            ]
        }),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/package'),
        clean: true
    }
};