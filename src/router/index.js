import Vue from "vue";
import Router from "vue-router";

import Dashboard from "@/components/Dashboard";

import Login from "@/components/pages/Login";
import Product from "@/components/pages/Product";
import Order from "@/components/pages/Order";
import Coupon from "@/components/pages/Coupon";
import MockOrder from "@/components/pages/MockOrder";

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
          },
        },
        {
          path: "orders",
          name: "Orders",
          component: Order,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: "coupon",
          name: "Coupon",
          component: Coupon,
          meta: {
            requiresAuth: true
          },
        },
        
      ],
    },
    {
      path: "/mockorder",
      // name: "MockOrder",
      component: Dashboard,
      children: [
        {
          path: "",
          name: "MockOrder",
          component: MockOrder,
        }
      ]
    },
  ]
});
