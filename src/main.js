import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {http} from './assets/js/request.js'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.prototype.$http=http
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
