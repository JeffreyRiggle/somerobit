const path = require('path');

module.exports = (env) => {
    return {
        entry: './src/main.js',
        target: 'node',
        output: {
            path: env.production ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'build'),
            filename: 'bundle.js'
        }
    }
}