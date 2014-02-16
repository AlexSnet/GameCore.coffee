module.exports = {
    // context: './src',
    entry: './src/gamecore.coffee',
    output: {
        path: './dist',
        filename: 'gamecore.js'
    },

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
    }
}