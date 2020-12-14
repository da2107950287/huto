module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  outputDir: 'huto',
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'assets': '@/assets',
        'views': '@/views',
      }
    },

  },
  devServer: {
    proxy: {
      "/room": {
        target: "http://8.210.86.180:80/room",
        changeOrigin: true,
        pathRewrite: { '^/room': '' }
      },
      
    }
  }
}