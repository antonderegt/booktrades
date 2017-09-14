import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import EditBookDetailsDialog from './components/Book/Edit/EditBookDetailsDialog.vue'
import EditUserDetailsDialog from './components/Book/Edit/EditUserDetailsDialog.vue'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-book-details-dialog', EditBookDetailsDialog)
Vue.component('app-edit-user-details-dialog', EditUserDetailsDialog)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBUxa6gd5k-GFNApz8n91g2-s_9mSk0e2E',
      authDomain: 'booktrades-a01e0.firebaseapp.com',
      databaseURL: 'https://booktrades-a01e0.firebaseio.com',
      projectId: 'booktrades-a01e0',
      storageBucket: 'booktrades-a01e0.appspot.com'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
          .then(() => {
            this.$store.dispatch('loadUserData')
          })
      }
    })
    this.$store.dispatch('loadBooks')
  }
})
