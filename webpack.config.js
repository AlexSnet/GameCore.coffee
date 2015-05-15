var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: {
	game: path.join(__dirname, 'src', 'gamecore.coffee')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: '[hash]/js/[id].js',
        sourceMapFilename: '[name].map',
        hotUpdateMainFilename: "[hash]/update.json",
        hotUpdateChunkFilename: "[hash]/js/[id].update.js"	
    },

    // recordsOutputPath: path.join(__dirname, "records.json"),

    target: "web",
    cache: true,

    module: {
        loaders: [
            {
                test: /\.coffee$/,
                loader: "coffee-loader"
            }
        ]
    },
    resolve: {
        extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js']
    },
    plugins: [
	   new webpack.optimize.DedupePlugin(),
       new webpack.optimize.UglifyJsPlugin()
    ]
}
