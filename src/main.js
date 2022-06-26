import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZv6febo-sC6MjJwvgkFwldEsN2-QtA5M",
  authDomain: "wixlings.firebaseapp.com",
  databaseURL: "https://wixlings-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wixlings",
  storageBucket: "wixlings.appspot.com",
  messagingSenderId: "473235909379",
  appId: "1:473235909379:web:aa8578d20ff5a2b7991736",
  measurementId: "G-E0MTXKGF5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

console.image = function(url, size = 10) {
          var image = new Image();
          image.onload = function() {
            var style = [
              'font-size: 1px;',
              'padding: ' + this.height/100*size + 'px ' + this.width/100*size + 'px;',
              'background: url('+ url +') no-repeat;',
              'background-size: contain;'
             ].join(' ');
             console.log('%c ', style);
          };
          image.src = url;
        };
         console.image('https://pibig.info/uploads/posts/2021-10/1635202851_14-pibig-info-p-menkhera-kayako-chan-anime-krasivo-15.jpg')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
