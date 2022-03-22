const path = require('path');
// const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: './src/script.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // plugins: [
    //     new webpack.ContextReplacementPlugin(
    //         /date\-fns[\/\\]/,
    //         new RegExp(`[/\\\\\](${supportedLocales.join('|')})[/\\\\\]index\.js$`)
    //     ),
    // ]
}