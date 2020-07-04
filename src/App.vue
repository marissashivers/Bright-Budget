<template>
  <div id="app">

    <Navigation 
      :user="user" 
      @logout="logout"
    />
    <!-- pass "user" as prop in router -->
    <router-view 
      class="container" 
      :user="user" 
      :meetings="meetings"
      :purchases="purchases"
      @logout="logout" 
      @addMeeting="addMeeting"
      @deleteMeeting="deleteMeeting"
      @addPurchase="addPurchase"
    />

  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import { auth, db } from './firebase';

export default {
  name: 'App',
  components: {
    Navigation,
  },
  data: function() {
    return {
      user: null,
      meetings: [],
      purchases: [],
    };
  },
  methods: {
    logout: function() {
      auth.signOut()
      .then( () => {
        this.user = null;
        this.$router.push("login");
      })
    },
    addMeeting: function(payload) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("meetings").add({
        name: payload,
        createdAt: new Date()
      });
    },
    deleteMeeting: function(payload) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("meetings")
      .doc(payload)
      .delete();
    },
    addPurchase: function(location, amount) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("purchases").add({
        purchaseLocation: location,
        purchaseAmount: amount
      });
    }
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        // reading dynamic snapshot for users collection
        db.collection("users")
        .doc(this.user.uid)
        .collection("meetings")
        .orderBy("name")
        .onSnapshot(snapshot => {
          const snapData = [];
          snapshot.forEach(doc => {
            snapData.push({
              id: doc.id,
              name: doc.data().name
            });
          });
          // sort the old fashion way
          this.meetings = snapData.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1;
            } else {
              return 1;
            }
          });
        });
      } // end if
      // for purchases...
      if (user) {
        this.user = user;
        // reading dynamic snapshot for users collection
        db.collection("users")
        .doc(this.user.uid)
        .collection("purchases")
        .orderBy("purchaseLocation")
        .onSnapshot(snapshot => {
          const snapData = [];
          snapshot.forEach(doc => {
            snapData.push({
              id: doc.id,
              purchaseLocation: doc.data().purchaseLocation,
              purchaseAmount: doc.data().purchaseAmount
            });
          });
          // sort the old fashion way
          this.purchases = snapData.sort((a, b) => {
            if (a.purchaseLocation.toLowerCase() < b.purchaseLocation.toLowerCase()) {
              return -1;
            } else {
              return 1;
            }
          });
        });
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