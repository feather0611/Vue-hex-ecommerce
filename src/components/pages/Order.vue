<template>
  <div>
    <loading :active.sync="status.isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <th width="120">購買時間</th>
        <th>Email</th>
        <th width="120">購物明細</th>
        <th width="120">應付金額</th>
        <th width="100">是否付款</th>
      </thead>
      <tbody v-if="orders.length!=0">
        <tr v-for="item in orders" :key="item.id">
          <td>{{ new Date(item.create_at) }}</td>
          <td>{{ item.user.email }}</td>
          <td class="text-right">{{ item.origin_price }}</td>
          <td class="text-right">{{ item.price | currency }}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else>未付款</span>
          </td>
        </tr>
      </tbody>
      <div v-else class="col-md-9 ml-sm-auto col-lg-10 mt-4">無資料</div>
    </table>

    <!-- Pagination -->
    <Pagination :pagination="pagination" @switch="getOrders" v-if="orders.length!=0"></Pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      pagination: {},
      status: {
        isLoading: false,
      }
    };
  },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.status.isLoading = true;
      this.$http.get(api, vm).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.orders = response.data.orders;
          vm.pagination = response.data.pagination;
        }
        else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
        vm.status.isLoading = false;
      });
    },

  },
  created() {
    const hexToken = document.cookie
      .split("; ")
      .find(row => row.startsWith("hexToken="))
      .split("=")[1];
    this.$http.defaults.headers.common.Authorization = hexToken;
    this.getOrders();
  }
}
</script>