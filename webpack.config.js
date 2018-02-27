const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ajax.js',
        library: 'ajax',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
    ],
    externals: {
        querystring: {
            commonjs: 'querystring',
            commonjs2: 'querystring',
            amd: 'querystring',
            root: 'queryString'
        },
        path: {
            commonjs: 'path',
            commonjs2: 'path',
            amd: 'path',
            root: 'path'
        }
    }
};

const dev = {
    devtool: 'cheap-source-map'
};

const prod = {
    devtool: 'nosource-source-map',
    output: {
        filename: 'ajax.min.js',
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};

module.exports = [
    merge(common, dev),
    merge(common, prod)
];
