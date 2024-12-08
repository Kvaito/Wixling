<template>
  <div class="layout-global">
    <Inventory/>
  </div>
</template>

<script>
import Inventory from "~/src/UI/Inventory.vue";

export default {
  name: 'Layout',
  components: {Inventory},
}
</script>

<style scoped>
.layout-global {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>