// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const srcDir = path.resolve(__dirname, "src");
const genMap = require("./src/pino-log-link/genMap");

module.exports = {
    entry: "./src/index.ts", // Your TypeScript entry point
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: "inline-source-map", // For better debugging
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
        new webpack.DefinePlugin({
            "process.env.MODULE_MAP": JSON.stringify(
                genMap(fs, path, srcDir, "webpack://astron/bigimg/src/")
            ),
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        compress: true,
        port: 9000, // Choose your desired port
        hot: true, // Enable hot reloading
    },
};
