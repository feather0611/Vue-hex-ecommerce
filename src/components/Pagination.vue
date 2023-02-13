<template>
  <div>
    <nav aria-label="...">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: !pagination.has_pre }">
          <span
            class="page-link"
            @click.prevent="switchPage(pagination.current_page - 1)"
            >Previous</span
          >
        </li>
        <li
          class="page-item"
          :class="{ active: pagination.current_page == page }"
          v-for="page in pagination.total_pages"
          :key="page"
        >
          <a class="page-link" href="#" @click.prevent="switchPage(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.has_next }">
          <a
            class="page-link"
            href="#"
            @click.prevent="switchPage(pagination.current_page + 1)"
            >Next</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
    name: "Pagination",
    props: ['pagination'],
    data() {
        return {
            // pagination: this.pagination,
        };
    },
    methods: {
        switchPage(page) {
            this.$emit('switch', page);
        }
    }
}
</script>
