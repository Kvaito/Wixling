<template>
  <div class="layout-global">
    <Inventory/>
    <WorldActions/>
  </div>
</template>

<script>
import Inventory from "~/src/UI/Inventory.vue";
import WorldActions from "~/src/UI/WorldActions.vue";

export default {
  name: 'Layout',
  components: {WorldActions, Inventory},
}
</script>

<style scoped>
.layout-global {
  color:white;
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>