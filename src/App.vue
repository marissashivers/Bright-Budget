<template>
  <div id="app">

    <!-- NAVBAR -->
    <Navigation 
      :user="user" 
      @logout="logout"
    />
    <!-- pass props to router -->
    <router-view 
      class="container" 
      :user="user" 
      :meetings="meetings"
      :purchases="purchases"
      :categories="categories"
      @logout="logout" 
      @addMeeting="addMeeting"
      @deleteMeeting="deleteMeeting"
      @addPurchase="addPurchase"
      @savePurchase="savePurchase"
      @deletePurchase="deletePurchase"
      @addCategory="addCategory"
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
      categories: []
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
    addPurchase: function(location, amount, category, date) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("purchases").add({
        purchaseLocation: location,
        purchaseAmount: Number(amount),
        createdAt: date,
        purchaseCategory: category
      });
    },
    savePurchase: function(purchaseToEdit) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("purchases")
      .doc(purchaseToEdit.id)
      .update({
        purchaseLocation: purchaseToEdit.purchaseLocation,
        purchaseAmount: Number(purchaseToEdit.purchaseAmount),
        createdAt: purchaseToEdit.createdAt,
        purchaseCategory: purchaseToEdit.purchaseCategory
      });      
    },
    addCategory: function(payload) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("categories")
      .add({
        category: payload
      });
    },
    deletePurchase: function(purchaseId) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("purchases")
      .doc(purchaseId)
      .delete();
    },
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("--> Accessing firebase database...");
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
        // purchases collection
        db.collection("users")
        .doc(this.user.uid)
        .collection("purchases")
        .orderBy("createdAt")
        .onSnapshot(snapshot => {
          const snapData = [];
          snapshot.forEach(doc => {
            snapData.push({
              id: doc.id,
              purchaseLocation: doc.data().purchaseLocation,
              purchaseAmount: doc.data().purchaseAmount,
              createdAt: doc.data().createdAt,
              purchaseCategory: doc.data().purchaseCategory
            });
          });
          // Return purchase in order from most recent purchase.
          this.purchases = snapData.reverse();
        });
        // categories database
        db.collection("users")
        .doc(this.user.uid)
        .collection("categories")
        .orderBy("category")
        .onSnapshot(snapshot => {
          const snapData = [];
          snapshot.forEach(doc => {
            snapData.push( {
              id: doc.id,
              category: doc.data().category
            });
          });
          // sort?
          this.categories = snapData;
        });
      } // end if
    });
  }, // end mounted
}
</script>

<style lang="scss">
$theme-colors: (
  primary: gray,
);
@import "node_modules/bootstrap/scss/bootstrap";

</style>