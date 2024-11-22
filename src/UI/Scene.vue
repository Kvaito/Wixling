<template>
  <div ref="engine">

  </div>
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

</style>