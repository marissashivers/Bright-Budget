<template>
  <div id="app">

    <!-- NAVBAR -->
    <Navigation />
    <!-- pass props to router -->
    <!-- TODO: remove passing props to router, should be using Vuex store. -->
    <router-view 
      class="container"  
    />

  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
//import { auth } from './firebase';

export default {
  name: 'App',
  components: {
    Navigation,
  },
  methods: {
  },
  mounted() {
  },
}
</script>

<style lang="scss">
$theme-colors: (
  primary: #352369,
  info: #908aa1,
);
$font-family-base: 'Roboto', sans-serif;
@import "node_modules/bootstrap/scss/bootstrap";
@import url('https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&family=Source+Sans+Pro&display=swap');</style>