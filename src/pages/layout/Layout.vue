<template>
  <Navbar />
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-12 mx-auto">
        <div class="mb-4 w-100 w-md-50 w-lg-25">
          <h3>{{ title }}</h3>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>

import Navbar from "./Navbar.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
});

</script>