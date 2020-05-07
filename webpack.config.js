const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, args) => {
    return {
        entry: './src/ts/main.js',
        output: {
            filename: 'js/bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },

        devServer: {
            contentBase: './dist'
        },

        optimization: {
            minimize: true,
            minimizer: [
                new TerserWebpackPlugin(),
                new OptimizeCssAssetsPlugin()
            ]
        },

        plugins: [
            new MinCssExtractPlugin({
                filename: 'css/bundle.min.css'
            }),
            new HTMLWebpackPlugin({
                filename: "index.html",
                template: "src/index.html"
            })
        ],

        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        args.mode !== 'production' ? 'style-loader' : MinCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { url: false, sourceMap: true } },
                        { loader: 'sass-loader', options:  {sourceMap: true } }
                    ]
                }
            ]
        }
    }
}