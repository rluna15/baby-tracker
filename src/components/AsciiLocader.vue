<template>
  <div class="ascii-loader">
    <pre>{{ loader }}</pre>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

export default {
  setup() {
    const frames = [
      "Loading...  \\",
      "Loading...  |",
      "Loading...  /",
      "Loading...  -",
    ];

    const currentFrame = ref(0);
    const loaderInterval = ref(null);

    const loader = computed(() => frames[currentFrame.value]);

    const startLoader = () => {
      loaderInterval.value = setInterval(() => {
        currentFrame.value = (currentFrame.value + 1) % frames.length;
      }, 250); // Change frame every 250ms
    };

    const stopLoader = () => {
      clearInterval(loaderInterval.value);
    };

    onMounted(startLoader);
    onBeforeUnmount(stopLoader);

    return {
      loader,
    };
  },
};
</script>

<style scoped>
.ascii-loader {
  font-family: monospace;
  /* font-size: 1.5em; */
  letter-spacing: 1px;
  text-align: center;
  color: #4caf50;
  /* Example color */
}
</style>
