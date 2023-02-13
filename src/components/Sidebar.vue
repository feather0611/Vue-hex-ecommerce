<template>
  <div>
    <nav class="col-md-2 d-none d-md-block bg-light sidebar">
      <div class="sidebar-sticky">
        <ul class="nav flex-column">
          <h6
            class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
          >
            <span>管理介面</span>
          </h6>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products" active-class="active">
              <i class="fas fa-box"></i>
              <span>產品列表</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/orders" active-class="active">
              <i class="fas fa-clipboard-list"></i>
              <span>訂單列表</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/coupon" active-class="active">
              <i class="fas fa-ticket-alt"></i>
              <span>優惠券</span>
            </router-link>
          </li>
        </ul>

        <h6
          class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
        >
          <span>模擬功能</span>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/mockorder" active-class="active">
              <i class="fas fa-shopping-cart"></i>
              模擬訂單
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
i {
  width: 18px;
  text-align: center;
}
</style>

