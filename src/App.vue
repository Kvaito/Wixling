<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.boldText
{
  font-weight: bold;
}
.closeWindow
{
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 20px;
  color: white;
}
.closeWindow:hover
{
  cursor: pointer;
  background-color: rgb(44, 62, 80);
  border-radius: 0 0 0 10px;
}
.RegularInput
{
  border-radius: 10px;
}
.buyButton
{
  background-color: aquamarine;
  border-radius: 15px;
  width: 80px;
  height: 40px;
}
.buyButton:hover
{
  cursor: pointer;
  outline: solid 3px #ffffff;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background-color: #b9bddb;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #2c3e50;
  border-radius: 10px;
    /*box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);*/
}

</style>
