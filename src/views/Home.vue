<template>
  <div class="home">
    <div class="text-secondary text-center">
      <div v-if="user" class="text-center">
        Welcome back 
        <span class="font-weight-bold text-info">{{ user.displayName }}</span>,
        <a href="#" class="text-primary" role="button" @click="$emit('logout')">logout</a>
      </div>
    </div>
    <div class="container text-center">
      <div class="row justify-content-center">
        <div class="col-10 col-md-10 col-lg-8 col-xl-7">
          <h4 class="display-4 text-primary mt-3 mb-2">Budgeting Tool</h4>
          <p class="lead">
            This simple app lets you input all your purchases, allows you to analyze information, and 
            perform complex analysis on your purchases with a simple UI. It's a good example of a
            Single Page Application which includes connection to a database and
            routing. It's a practical way to learn
            <a href="https://vuejs.org/">Vue.js</a>
            with
            <a href="https://firebase.google.com">Firebase</a>. A majority of this material is taken
            from the LinkedIn learning course, "Vue.js: Full Stack Application with Firebase".
          </p>

          <!-- buttons -->
          <router-link
            class="btn btn-outline-primary mr-2"
            to="/register"
            v-if="!user"
          >Register</router-link>
          <router-link
            class="btn btn-outline-primary mr-2"
            to="/login"
            v-if="!user"
          >Log In</router-link>
          <router-link
            class="btn btn-primary"
            to="/purchases"
            v-if="user"
          >Purchases</router-link>
        </div>
      </div>
    </div>

<!-- 
    <ul> Souces
      <li>Firebase JavasScript SDK and reference</li>
      <li>https://www.positronx.io/vue-js-firebase-build-vue-crud-app-with-cloud-firestore/</li>
      <li>Bootstrap table layout</li>
      <li>Vuetify</li>
      <li>Datepicker</li>
      <li>Bootstrap Vue, Modal, forms</li>
      <li>Chart.js wrapper for Vue</li>
      <li>https://www.sitepoint.com/creating-beautiful-charts-vue-chart-js/</li>
      <li>HELPED WITH FIREBASE AUTH: https://stackoverflow.com/questions/56817919/import-firebase-firestore-returns-undefined</li>
      <li>Custom Pagination: https://codepen.io/bilalo05/pen/oNgrKXo</li>
    </ul>
-->

  </div>
</template>

<script>
export default {
  name: 'Home',
  props: ["user"],
  components: {
  },
  computed: {
    counter() {
      // retrieve "counter" using $store keyword that was registered in Vuex Store
      return this.$store.state.counter;
    },
    double() {
      return this.$store.getters.doubleClicks;
    }
  },
  mounted() {
  },
  methods: {
    clicked() {
      // commit (execute) the mutation called "increment"
      this.$store.commit('increment');
    }
  }
}
</script>
