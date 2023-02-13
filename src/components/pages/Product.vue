<template>
  <div>
    <loading :active.sync="status.isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4">
        建立新的商品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <th width="120">分類</th>
        <th>商品名稱</th>
        <th width="120">定價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th>編輯</th>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">{{ item.origin_price }}</td>
          <td class="text-right">{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">已啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm">
              編輯
            </button>
            <button class="btn btn-outline-danger btn-sm">
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <Pagination :pagination="pagination" @switch="getProducts"></Pagination>
  </div>
</template>

<script>
import Pagination from "../Pagination";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      products: [],
      pagination: {},
      status: {
        isLoading: false,
      }
    };
  },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/products?page=${page}`;
      const vm = this;
      vm.status.isLoading = true;
      this.$http.get(api, vm).then(response => {
        if (response.data.success) {
          // console.log(response.data);
          vm.status.isLoading = false;
          vm.products = response.data.products;
          vm.pagination = response.data.pagination;
        }
      });
    }
  },
  created() {
    this.getProducts();
    const hexToken = document.cookie
      .split("; ")
      .find(row => row.startsWith("hexToken="))
      .split("=")[1];
    this.$http.defaults.headers.common.Authorization = hexToken;
  }
};
</script>
