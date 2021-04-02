module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/incremental-game-template/'
        : '/',
    pages: {
        index: {
            entry: 'src/main.ts',
            title: 'Voidlings Sphere'
        }
    }
}