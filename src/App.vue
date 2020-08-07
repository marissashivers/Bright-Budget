<template>
  <div class="main-container">
    <!-- NAVBAR -->
    <Navigation />
    <!-- pass props to router -->
    <!-- TODO: remove passing props to router, should be using Vuex store. -->
    <router-view />
    <footer class="footer">
      <div class="container">
        <span class="text-muted">created by <a href="https://marissashivers.github.io" target="_blank">Marissa Shivers</a></span>
        <a href="https://github.com/marissashivers" target="_blank"><font-awesome-icon class="fa-lg customIcon" :icon="['fab', 'github']" /></a>
        <a href="https://www.linkedin.com/in/marissashivers" target="_blank"><font-awesome-icon class="fa-lg customIcon" :icon="['fab', 'linkedin']" /></a>
      </div>
    </footer>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
//import { auth } from './firebase';

export default {
  name: "App",
  components: {
    Navigation,
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }
  *:before,
  *:after {
    box-sizing: border-box;
  }
  html,
  body {
    height: 100%;
    position: relative;
  }
  .main-container {
    min-height: 100vh; /* will cover the 100% of viewport */
    overflow: hidden;
    display: block;
    position: relative;
    padding-bottom: 100px; /* height of your footer */
  }
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .footer {
    padding-left: 60px;
    padding-right: 60px;
    background-color: gainsboro;
    line-height: 60px;
  }
  .text-muted {
    color: #6c757d !important;
  }
  .container {
    width: auto;
    padding: 0 15px;
    text-align: right;
  }
  .customIcon {
    margin-left: 10px;
  }
</style>

<style lang="scss">
$theme-colors: (
  primary: #352369,
  info: #908aa1,
);
$font-family-base: "Roboto", sans-serif;
@import "node_modules/bootstrap/scss/bootstrap";
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&family=Source+Sans+Pro&display=swap");
</style>
