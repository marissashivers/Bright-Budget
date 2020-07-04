<template>
  <div id="app">
    <Navigation />
    <!-- pass "user" as prop in router -->
    <router-view class="container" :user="user" @logout="logout"/>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import { auth } from './firebase';

export default {
  name: 'App',
  components: {
    Navigation,
  },
  data: function() {
    return {
      user: null
    };
  },
  methods: {
    logout: function() {
      auth.signOut()
      .then( () => {
        this.user = null;
        this.$router.push("login");
      })
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user.displayName
      }
    });
  },
}
</script>

<style lang="scss">
$theme-colors: (
  primary: gray,
);
@import "node_modules/bootstrap/scss/bootstrap";

</style>