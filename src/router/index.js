import Vue from "vue";
import Router from "vue-router";

import Dashboard from "@/components/Dashboard";

import Login from "@/components/pages/Login";
import Product from "@/components/pages/Product";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "*",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/admin",
      name: "Dashboard",
      component: Dashboard,
      children: [
        {
          path: "products",
          name: "Products",
          component: Product,
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
  ]
});
