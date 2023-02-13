<template>
  <div>
    <Alert></Alert>
    <form class="form-signin mt-4" @submit.prevent="signIn">
      <!-- <img
          class="mb-4"
          src="../../assets/brand/bootstrap-solid.svg"
          alt=""
          width="72"
          height="72"
        /> -->
      <h1 class="h3 mb-3 font-weight-normal">請登入</h1>
      <label for="inputEmail" class="sr-only">電子郵件 Email</label>
      <input
        v-model="user.username"
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="電子郵件 Email"
        required
        autofocus
      />
      <label for="inputPassword" class="sr-only">密碼 Password</label>
      <input
        v-model="user.password"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="密碼 Password"
        required
      />
      <!-- <div class="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>
        </div> -->
      <button class="btn btn-lg btn-primary btn-block mt-4" type="submit">
        登入 Sign in
      </button>
      <p class="mt-5 mb-3 text-muted">Nick Lin &copy; 2023</p>
    </form>
  </div>
</template>

<script>
import Alert from "../AlertMessage";

export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    };
  },
  components: {
    Alert
  },
  methods: {
    signIn() {
      const api = `${process.env.API_SERVER}/admin/signin`;
      const vm = this;
      this.loading = true;
      this.$http.post(api, vm.user).then(response => {
        if (response.data.success) {
          const token = response.data.token;
          const expired = response.data.expired;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          // vm.$router.push("/admin/products");
          this.$bus.$emit("message:push", response.data.message, "success");
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    }
  }
};
</script>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
