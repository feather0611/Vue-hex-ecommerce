// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

import "bootstrap";

import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
  configure
} from "vee-validate";
import TW from "vee-validate/dist/locale/zh_TW.json";
import * as rules from "vee-validate/dist/rules";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.min.css";

import Alert from "./components/AlertMessage";
import Pagination from "./components/Pagination";

import App from "./App";
import router from "./router";
import "./bus";
import currencyFilter from "./filters/currency";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

// Vee-Validate
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

extend("phone", {
  validate: value => {
    const reg = /^0\d{1,2}-\d{7,8}$|^09\d{2}-\d{6}$/g;
    return reg.test(value);
  },
  message: "請輸入正確的電話或手機號碼"
});

localize("zh_TW", TW);

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

configure({
  classes: {
    valid: "is-valid",
    invalid: "is-invalid"
  }
});
// Vee-Validate end

axios.defaults.withCredentials = true;

Vue.component("Loading", Loading);
Vue.component("Alert", Alert);
Vue.component("Pagination", Pagination);

Vue.filter("currency", currencyFilter);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_SERVER}/api/user/check`;
    axios.post(api).then(response => {
      if (response.data.success) {
        next();
      } else {
        next({
          path: "/login"
        });
      }
    });
  } else if (to.path == "/login") {
    const api = `${process.env.API_SERVER}/api/user/check`;
    axios.post(api).then(response => {
      if (response.data.success) {
        next({
          path: "/admin/products"
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});
