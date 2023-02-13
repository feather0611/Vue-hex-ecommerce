<template>
  <div>
    <loading :active.sync="status.isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4" @click.prevent="openModal(true)">
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
    </table>

    <!-- Pagination -->
    <Pagination :pagination="pagination" @switch="getProducts"></Pagination>
    
    <!-- Product Modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span v-if="isNew">新增商品</span>
              <span v-else>編輯商品</span>
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
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                    v-model="tempProduct.image"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile"
                    >或 上傳圖片
                    <i
                      class="fas fa-spinner fa-spin"
                      v-if="status.fileUploading"
                    ></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadImg"
                  />
                </div>
                <img :src="tempProduct.image" class="img-fluid" alt="" />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">商品名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入商品名稱"
                    v-model="tempProduct.title"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                      v-model="tempProduct.category"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                      v-model="tempProduct.unit"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                      v-model="tempProduct.origin_price"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                      v-model="tempProduct.price"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">商品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入商品描述"
                    v-model="tempProduct.description"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入商品說明內容"
                    v-model="tempProduct.content"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempProduct.is_enabled"
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
              @click="updateProduct"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Del Product Modal -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除商品</span>
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
            <strong class="text-danger">{{ tempProduct.title }}</strong>
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
              @click.prevent="deleteProduct"
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

import Pagination from "../Pagination";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      products: [],
      tempProduct: {},
      pagination: {},
      isNew: false,
      status: {
        isLoading: false,
        fileUploading: false
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
    },
    openModal(isNew, item) {
      $("#productModal").modal("show");
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
    },
    openDelModal(item) {
      this.tempProduct = Object.assign({}, item);
      $("#delProductModal").modal("show");
    },
    updateProduct() {
      let api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/product`;
      let httpMethod = "post";
      let message = "新增成功";
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = "put";
        message = "修改成功";
      }
      this.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        if (response.data.success) {
          // console.log(response.data);
          $("#productModal").modal("hide");
          this.$bus.$emit("message:push", message, "success");
          vm.getProducts();
        } else {
          $("#productModal").modal("hide");
          this.$bus.$emit("message:push", response.data.message, "danger");
          vm.getProducts();
        }
      });
    },
    deleteProduct() {
      const vm = this;
      const api = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api, { data: vm.tempProduct }).then(response => {
        if (response.data.success) {
          // console.log(response.data);
          $("#delProductModal").modal("hide");
          this.$bus.$emit("message:push", "刪除成功", "success");
          vm.getProducts();
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
          $("#delProductModal").modal("hide");
          vm.getProducts();
        }
      });
    },
    uploadImg() {
      //   console.log(this);
      const vm = this;
      vm.status.fileUploading = true;
      const uploadFile = this.$refs.files.files[0];
      const formData = new FormData();
      formData.append("file-to-upload", uploadFile);
      const url = `${process.env.API_SERVER}/api/${process.env.API_PATH}/admin/upload`;
      this.$http
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          // console.log(response.data);
          if (response.data.success) {
            // vm.tempProduct.imageUrl = response.data.imageUrl;
            // console.log(vm.tempProduct);
            vm.$set(vm.tempProduct, "image", response.data.imageUrl);
            this.$refs.files.value = null;
            this.$bus.$emit("message:push", "上傳成功", "success");
          } else {
            this.$bus.$emit("message:push", response.data.message, "danger");
          }
          vm.status.fileUploading = false;
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
