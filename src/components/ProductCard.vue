<template>
    <div class="col-md-4 mb-4">
      <div class="card border-0 shadow-sm">
        <div
          :style="{ backgroundImage: `url(${product.image})` }"
          style="height: 150px; background-size: cover; background-position: center"
        ></div>
        <div class="card-body">
          <span class="badge badge-secondary float-right ml-2">{{
            product.category
          }}</span>
          <h5 class="card-title">
            <a href="#" class="text-dark">{{ product.title }}</a>
          </h5>
          <p class="card-text">{{ product.content }}</p>
          <div class="d-flex justify-content-between align-items-baseline">
            <!-- <div class="h5">2,800 元</div> -->
            <del class="h6">原價 {{ product.origin_price }} 元</del>
            <div class="h5">現在只要 {{ product.price }} 元</div>
          </div>
        </div>
        <div class="card-footer d-flex">
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="getInfo(product.id)"
          >
            <i class="fas fa-spinner fa-spin" v-if="loading === product.id"></i>
            查看更多
          </button>
          <button
            type="button"
            class="btn btn-outline-danger btn-sm ml-auto"
            @click="addToCart(product.id)"
          >
            <i class="fas fa-spinner fa-spin" v-if="cart === product.id"></i>
            加到購物車
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProductCard",
    props: ["product", "loading", "cart"],
    data() {
      return {};
    },
    methods: {
      getInfo(id) {
        this.$emit("get-product", id);
      },
      addToCart(id) {
        this.$emit("add-to-cart", id);
      }
    }
  };
  </script>
  