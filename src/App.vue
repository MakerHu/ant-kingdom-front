<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 15px;*/
  height: calc(100vh - 4px);
}

#roombody {
  margin: 0;
  background-image: linear-gradient(to top, #0ba360 0%, #3cba92 100%);
  background-size:100% 100%;
  background-attachment:fixed;
}
</style>
