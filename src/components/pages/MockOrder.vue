<template>
  <div>
    <loading :active.sync="status.pageLoading"></loading>
    <div class="row mt-4">
      <ProductCard
        v-for="item in filteredProducts"
        :key="item.id"
        :product="item"
        :loading="status.itemLoading"
        :cart="status.cartLoading"
        @get-product="getProduct"
        @add-to-cart="addToCart"
      />
    </div>

    <table class="table">
      <thead>
        <th></th>
        <th>品名</th>
        <th>數量</th>
        <th>單價</th>
      </thead>
      <tbody v-if="cart.carts && cart.carts.length > 0">
        <tr v-for="item in cart.carts" :key="item.id">
          <td class="align-middle">
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="deleteCart(item.id)"
            >
              <i class="far fa-trash-alt"></i>
            </button>
          </td>
          <td class="align-middle">
            {{ item.product.title }}
            <div class="text-success" v-if="item.coupon">
              已套用優惠券
            </div>
          </td>
          <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
          <td class="align-middle text-right">{{ item.final_total }}</td>
        </tr>
      </tbody>
      <div v-else class="col-md-9 ml-sm-auto col-lg-10 m-3">沒有商品</div>
      <tfoot>
        <tr>
          <td colspan="3" class="text-right">總計</td>
          <td class="text-right">{{ cart.total }}</td>
        </tr>
        <tr v-if="cart.final_total !== cart.total">
          <td colspan="3" class="text-right text-success">折扣價</td>
          <td class="text-right text-success">{{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="input-group mb-3 input-group-sm">
      <input
        type="text"
        class="form-control"
        placeholder="請輸入優惠碼"
        v-model="coupon_code"
      />
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="applyCoupon"
        >
          套用優惠碼
        </button>
      </div>
    </div>

    <div class="my-5 row justify-content-center">
      <validation-observer v-slot="{ invalid, handleSubmit }" class="col-md-6">
        <form @submit.prevent="handleSubmit(createOrder)">
          <validation-provider
            rules="required|email"
            v-slot="{ errors, classes }"
          >
            <div class="form-group">
              <label for="useremail">Email</label>
              <input
                type="email"
                class="form-control"
                name="Email"
                id="useremail"
                v-model="form.user.email"
                placeholder="請輸入 Email"
                :class="classes"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </div>
          </validation-provider>
          
          <validation-provider
            rules="required"
            v-slot="{ errors, classes }"
          >
          <div class="form-group">
            <label for="username">收件人姓名</label>
            <input
              type="text"
              class="form-control"
              name="姓名"
              id="username"
              v-model="form.user.name"
              placeholder="輸入姓名"
              :class="classes"
            />
            <span class="text-danger"
              >{{errors[0]}}</span
            >
          </div>
          </validation-provider>
          
          <validation-provider
            rules="required|phone"
            v-slot="{ errors, classes }"
          >
          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <input
              type="tel"
              class="form-control"
              id="usertel"
              name="電話"
              v-model="form.user.tel"
              placeholder="請輸入電話"
              :class="classes"
            />
            <span class="text-danger"
              >{{errors[0]}}</span
            >
          </div>
          </validation-provider>


          <validation-provider
            rules="required"
            v-slot="{ errors, classes }"
          >
          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <input
              type="text"
              class="form-control"
              name="地址"
              id="useraddress"
              v-model="form.user.address"
              placeholder="請輸入地址"
              :class="classes"
            />
            <span class="text-danger">{{errors[0]}}</span>
          </div>
          </validation-provider>

          <div class="form-group">
            <label for="comment">留言</label>
            <textarea
              name=""
              id="comment"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>

          <div class="text-right">
            <button class="btn btn-danger" :disabled="invalid">送出訂單</button>
          </div>
        </form>
      </validation-observer>
    </div>

    <!-- Product Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ product.title }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.image" class="img-fluid" alt="" />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">
                {{ product.description }}
              </footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">
                {{ product.origin_price }}
              </div>
              <del class="h6" v-if="product.price"
                >原價 {{ product.origin_price }} 元</del
              >
              <div class="h4" v-if="product.price">
                現在只要 {{ product.price }} 元
              </div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option
                :value="num"
                v-for="num in 10"
                :key="num"
                :selected="num === 1"
                >選購 {{ num }} {{ product.unit }}</option
              >
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong>
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id, product.num, false)"
            >
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import ProductCard from "../ProductCard";

export default {
  data() {
    return {
      products: [],
      product: {},
      cart: {},
      form: {
        user: {
          email: "",
          name: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      status: {
        pageLoading: false,
        itemLoading: "",
        cartLoading: ""
      },
      coupon_code: ""
    };
  },
  components: {
    ProductCard
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/products/all`;
      vm.status.pageLoading = true;
      vm.$http.get(url).then(response => {
        vm.products = response.data.products;
        vm.status.pageLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/product/${id}`;
      vm.status.itemLoading = id;
      this.$http.get(url).then(response => {
        vm.product = response.data.product;
        vm.openModal();
        vm.status.itemLoading = "";
      });
    },
    openModal() {
      $("#productModal").modal("show");
    },
    closeModal() {
      $("#productModal").modal("hide");
    },
    addToCart(id, qty = 1, loading = true) {
      const vm = this;
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/cart`;
      if (loading === true) {
        vm.status.cartLoading = id;
      }
      const cart = {
        product_id: id,
        qty
      };
      this.$http.post(url, { data: cart }).then(response => {
        if (loading === true) {
          vm.status.cartLoading = "";
        } else {
          vm.closeModal();
        }

        if (response.data.success) {
          this.$bus.$emit("message:push", response.data.message, "success");
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
        vm.getCart();
      });
    },
    getCart() {
      const vm = this;
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/cart`;
      vm.status.pageLoading = true;
      vm.$http.get(url).then(response => {
        vm.cart = response.data.data;
        vm.status.pageLoading = false;
      });
    },
    deleteCart(id) {
      const vm = this;
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/cart/${id}`;
      vm.status.pageLoading = true;
      vm.$http.delete(url).then(response => {
        console.log(response);
        vm.status.pageLoading = false;
        vm.getCart();
        if (response.data.success) {
          this.$bus.$emit("message:push", response.data.message, "success");
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    applyCoupon() {
      const vm = this;
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/coupon`;
      vm.status.pageLoading = true;
      vm.$http.post(url, { data: { code: vm.coupon_code } }).then(response => {
        console.log(response);
        vm.status.pageLoading = false;
        vm.getCart();
        if (response.data.success) {
          this.$bus.$emit("message:push", response.data.message, "success");
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/order`;
      vm.status.pageLoading = true;
      this.$validator.validate().then(result => {
        if (result) {
          vm.$http.post(url, { data: vm.form }).then(response => {
            vm.status.pageLoading = false;
            vm.getCart();
            if (response.data.success) {
              this.$bus.$emit("message:push", response.data.message, "success");
            } else {
              this.$bus.$emit("message:push", response.data.message, "danger");
            }
          });
        } else {
          vm.status.pageLoading = false;
          this.$bus.$emit("message:push", "欄位有誤", "danger");
        }
      });
    },
    testOrder() {
      console.log('送出訂單');
    }
  },
  computed: {
    filteredProducts() {
      const vm = this;
      return vm.products.filter(item => {
        return item.is_enabled;
      });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>
