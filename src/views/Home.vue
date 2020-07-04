<template>
  <div class="home">
    <div class="text-secondary text-center">
      <div v-if="user" class="text-center">
        Welcome back 
        <span class="font-weight-bold text-info">{{ user }}</span>,
        <a href="#" class="text-primary" role="button" @click="$emit('logout')">logout</a>
      </div>
    </div>
    <div class="container text-center">
      <div class="row justify-content-center">
        <div class="col-10 col-md-10 col-lg-8 col-xl-7">
          <h4 class="display-4 text-primary mt-3 mb-2">Budgeting Tool</h4>
          <p class="lead">
            This simple app lets you input all your purchases, allows you to analyze information, and
            picks random users to award giveaways. It's a good example of a
            Single Page Application which includes connection to a database and
            routing. It's a practical way to learn
            <a href="https://vuejs.org/">Vue.js</a>
            with
            <a href="https://firebase.google.com">Firebase</a>. A majority of this material is taken
            from the LinkedIn learning course, "Vue.js: Full Stack Application with Firebase".
          </p>

          <router-link
            class="btn btn-outline-primary mr-2"
            to="/register"
          >Register</router-link>
          <router-link
            class="btn btn-outline-primary mr-2"
            to="/login"
          >Log In</router-link>
          <router-link
            class="btn btn-primary"
            to="/meetings"
          >Meetings</router-link>
        </div>
      </div>
    </div>

    <!-- vuex experimentation -->
    <h1>Number of clicks: {{ counter }} </h1>
    <h1>Doubled clicks: {{ double }} </h1>
    <button @click="clicked">Click here </button>

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
