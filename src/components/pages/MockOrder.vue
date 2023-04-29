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
      carts: [],
      status: {
        pageLoading: false,
        itemLoading: "",
        cartLoading: ""
      }
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
        vm.carts = response.data.data.carts;
        vm.status.pageLoading = false;
      });
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
