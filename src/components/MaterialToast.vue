<template>
  <div class="position-fixed bottom-0 top-0 end-0 p-3" style="z-index: 11" v-if="showMessage">
    <div class="toast align-items-center text-white border-0 fade show" :class="`bg-${variant}`" role="alert" aria-live="assertive"
      aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <slot />
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
          aria-label="Close" :click="() => showMessage = false"></button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    variant: {
      type: String,
      default: 'danger',
    },
    timeToast: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      timerToast: null,
      showMessage: false,
    }
  },
  methods: {
    displayToast() {
      clearInterval(this.timerToast);
      this.showMessage = true;
      this.timerToast = setTimeout(() => {
        this.showMessage = false;
      }, this.timeToast);
    }
  }
}

</script>