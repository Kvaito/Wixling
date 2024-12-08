<template>
  <div class="game-global">
    <Scene/>
    <Layout/>
  </div>
</template>

<script>
import Scene from "~/src/UI/Scene.vue";
import Layout from "~/src/UI/Layout.vue";

export default{
  name:'Game',
  components: {Layout, Scene},
  mounted(){

  }
}
</script>


<style >
body{
  margin: 0;
}
.game-global{
  position: relative;
}
</style>