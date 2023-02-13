<template>
  <div>
    <loading :active.sync="loading"></loading>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top p-0">
      <a class="navbar-brand col-md-2 col-sm-3 col-4" href="#"
        >VueJS 實戰作業</a
      >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#toggleNavbar"
        aria-controls="toggleNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse navpad" id="toggleNavbar">
        <ul class="navbar-nav mr-auto">
          <li
            class="nav-item dropdown"
            :class="{ active: this.$route.matched[0].path == `/admin` }"
          >
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              >管理介面</a
            >
            <div class="dropdown-menu" aria-labelledby="navDropdown">
              <router-link class="dropdown-item" to="/admin/products"
                >產品列表</router-link
              >
              <router-link class="dropdown-item" to="/admin/orders"
                >訂單列表</router-link
              >
              <router-link class="dropdown-item" to="/admin/coupon"
                >優惠券</router-link
              >
            </div>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/mockorder">模擬訂單</router-link>
          </li>
        </ul>
        <ul class="navbar-nav mr-3">
          <li class="nav-item text-nowrap">
            <a class="nav-link" href="#" @click.prevent="logout">登出</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .navpad {
    padding-left: 1em;
  }
}
</style>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      loading: false
    };
  },
  methods: {
    logout() {
      const api = `${process.env.API_SERVER}/logout`;
      const vm = this;
      this.loading = true;
      this.$http.post(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/login");
        }
        this.loading = false;
      });
    }
  }
};
</script>
