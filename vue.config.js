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
        target: "http://47.111.244.224:8080/room",
        changeOrigin: true,
        pathRewrite: { '^/room': '' }
      },
      
    }
  }
}