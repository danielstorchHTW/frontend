module.exports = {
  devServer: {
    port: '3000'
  },
  publicPath: process.env.VUE_APP_BACKEND_BASE_URL === 'production'
      ? '/frontend/'
      : '/'
}