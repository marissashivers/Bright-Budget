<template>
  <div class="home">
    <!-- TODO: add screenshots to showcase app capabilities -->
    <div class="text-secondary text-center">
      <div v-if="userLoggedIn" class="text-center">
        {{ greeting }}, 
        <span class="font-weight-bold text-info">{{ displayName }}</span>! 
        <a href="#" class="text-primary" role="button" @click="logout()">logout</a>
      </div>
    </div>
    <div class="container text-center">
      <div class="row justify-content-center">
        <div class="col-10 col-md-10 col-lg-8 col-xl-7">
          <h4 class="display-4 text-primary mt-3 mb-2">Welcome <span v-if="userLoggedIn">back </span> <span v-if="!userLoggedIn">to WhereIsMyMoney</span></h4>
          <p class="lead" v-if="!userLoggedIn">
            This simple app lets you input all your purchases, allows you to analyze information, and 
            perform complex analysis on your purchases with a simple UI.
          </p>
          <p class="lead">
            Your money - in your control. Track what you spend, where you spend it, and see how you spend.
          </p>

          <!-- buttons -->
          <router-link
            class="btn btn-outline-primary mr-2"
            to="/register"
            v-if="!userLoggedIn"
          >Register</router-link>
          <router-link
            class="btn btn-outline-primary mr-2"
            to="/login"
            v-if="!userLoggedIn"
          >Log In</router-link>
          <router-link
            class="btn btn-primary"
            to="/purchases"
            v-if="userLoggedIn"
          >Purchases</router-link>
        </div>
      </div>
    </div>
    
    <Carousel v-if="!userLoggedIn" />

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
    </ul>
-->

  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    displayName() {
      return this.$store.getters.displayName;
    },
    userLoggedIn() {
      return this.$store.getters.user;
    },
    greeting() {
      var myDate = new Date();
      var hrs = myDate.getHours();
      if (hrs < 5) // 12:00am - 5:00am
        return "You're up early"
      if (hrs >= 5 && hrs < 12) // 5:00am - 12:00pm
        return 'Good morning';
      else if (hrs >= 12 && hrs <= 17) // 12:00pm to 5:00pm
        return 'Good afternoon';
      else if (hrs >= 17 && hrs <= 22) // 5:00pm to 10:00pm
        return 'Good evening';
      else return "You're up late";
    }
  },
  mounted() {
  },
  methods: {
    logout() {
      this.$store.dispatch("signOutAction")
      .then(() => {
        this.$router.push({path: '/'});
        console.log("here");
      }, error => {
          console.log(error.message);
      });
    }
  }
}
</script>

<style scoped>
  .home {
    margin: 25px;
  }
</style>