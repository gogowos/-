<template>
  <div style="text-align: center;">
    <v-progress-circular
      indeterminate
      color="#FFD700"
      size="64"
      width="4"
    ></v-progress-circular>
    <div class="loading-text">🎂 正在准备惊喜...</div>
  </div>
</template>

<script>
export default {
  name: 'loader'
};
</script>
