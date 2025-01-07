<template>
  <div ref="engine" class="scene-container"></div>
</template>

<script >
import {initEngine} from "~/src/Engine/Engine.ts";
import {$} from "~/src/Engine/state.ts";

export default {
  name:'Scene',
  mounted() {
    initEngine();
    $.engine.setContainer(this.$refs.engine)
  }
}
</script>

<style scoped>
.scene-container{
  width: 100% !important;
  height: 100% !important;
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  display: block;
}
</style>