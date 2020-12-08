module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'assets': '@/assets',
        'utils':'@/utils',
        'views': '@/views',
        'vue$': 'vue/dist/vue.esm.js' 
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