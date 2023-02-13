<template>
  <div>
    <loading :active.sync="status.isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4" @click.prevent="openModal(true)">
        建立新優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <th>名稱</th>
        <th width="150">折扣</th>
        <th width="150">到期日</th>
        <th width="150">是否啟用</th>
        <th width="150">編輯</th>
      </thead>
      <tbody v-if="coupons.length != 0">
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent | percent }}</td>
          <td>{{ item.date }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">已啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              @click.prevent="openModal(false, item)"
            >
              編輯
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click.prevent="openDelModal(item)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
      <div v-else class="col-md-9 ml-sm-auto col-lg-10 mt-4">無資料</div>
    </table>

    <!-- Pagination -->
    <Pagination :pagination="pagination" @switch="getCoupons" v-if="coupons.length!=0"></Pagination>

    <!-- Coupon Modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="couponModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="couponModalLabel">
              <span v-if="isNew">新增優惠券</span>
              <span v-else>編輯優惠券</span>
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
            <div class="row">
              <div class="col-sm">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入優惠券標題"
                    v-model="tempCoupon.title"
                  />
                </div>
                <div class="form-group">
                  <label for="code">優惠碼</label>
                  <input
                    type="text"
                    class="form-control"
                    id="code"
                    placeholder="請輸入優惠碼"
                    v-model="tempCoupon.code"
                  />
                </div>
                <div class="form-group">
                  <label for="date">到期日</label>
                  <input
                    type="date"
                    class="form-control"
                    id="date"
                    placeholder="請輸入到期日"
                    v-model="tempCoupon.date"
                  />
                </div>
                <div class="form-group">
                  <label for="percent">折扣</label>
                  <input
                    type="text"
                    class="form-control"
                    id="percent"
                    placeholder="折扣"
                    v-model="tempCoupon.percent"
                  />
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempCoupon.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="status.fileUploading"
              @click="updateCoupon"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Del Coupon Modal -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="delCouponModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="delCouponModalLabel">
              <span>刪除優惠券</span>
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
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong>
            (刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click.prevent="deleteCoupon"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      pagination: {},
      isNew: false,
      status: {
        isLoading: false
      }
    };
  },
  methods: {
    getCoupons(page = 1) {
      const api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.status.isLoading = true;
      this.$http.get(api, vm).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          vm.coupons = response.data.coupons;
          vm.pagination = response.data.pagination;
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
        vm.status.isLoading = false;
      });
    },
    openModal(isNew, item) {
      $("#couponModal").modal("show");
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
      }
    },
    openDelModal(item) {
      this.tempCoupon = Object.assign({}, item);
      $("#delCouponModal").modal("show");
    },
    updateCoupon() {
      let api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/coupon`;
      let httpMethod = "post";
      let message = "新增成功";
      this.tempCoupon.due_date =
        new Date(this.tempCoupon.date).getTime() / 1000;
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
        message = "修改成功";
      }
      vm.status.isLoading = true;
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          this.$bus.$emit("message:push", message, "success");
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
        vm.status.isLoading = false;
        $("#couponModal").modal("hide");
        vm.getCoupons();
      });
    },
    deleteCoupon() {
      const vm = this;
      const api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/Coupon/${vm.tempCoupon.id}`;
      vm.status.isLoading = true;
      this.$http.delete(api, { data: vm.tempCoupon }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          this.$bus.$emit("message:push", "刪除成功", "success");
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
        vm.status.isLoading = false;
        $("#delCouponModal").modal("hide");
        vm.getCoupons();
      });
    }
  },
  created() {
    const hexToken = document.cookie
      .split("; ")
      .find(row => row.startsWith("hexToken="))
      .split("=")[1];
    this.$http.defaults.headers.common.Authorization = hexToken;
    this.getCoupons();
  },
  filters: {
    percent(n) {
      return `${n} %`
    }
  }
};
</script>
