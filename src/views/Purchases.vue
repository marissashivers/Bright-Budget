<template>
  <div class="purchases">
    <!-- adding a purchase -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <h1 class="font-weight-light text-center">Add a Purchase/Category</h1>
        <div class="card bg-light">
          <div class="card-body text-center">
            <form class="formgroup">
              <div class="input-group">
                <!-- datepicker -->
                <datepicker v-model="createdAt" class="form-control">
                </datepicker>
                <input
                  type="text"
                  class="form-control"
                  name="purchaseLocation"
                  placeholder="Location"
                  aria-describedby="buttonAdd"
                  v-model="purchaseLocation"
                  ref="purchaseLocation"
                />
                <input
                  type="text"
                  class="form-control"
                  name="purchaseAmount"
                  placeholder="Amount"
                  aria-describedby="buttonAdd"
                  v-model="purchaseAmount"
                  ref="purchaseAmount"
                />
                <select
                  name="purchaseCategory"
                  class="form-control"
                  v-model="purchaseCategory"
                  aria-describedby="buttonAdd"
                  ref="purchaseCategory"
                >
                  <option value="null" disabled hidden>Category</option>
                  <option v-for="item in categories" :key="item.id">
                    {{ item.category }}
                  </option>
                </select>
                <!-- submit button for + -->
                <div class="input-group-append">
                  <button
                    type="submit"
                    class="btn btn-sm btn-info"
                    id="buttonAdd"
                    @click.prevent="handleAddPurchase"
                    style="padding: 0 15px"
                  >
                    +
                  </button>
                </div>
              </div>
              <!-- input-group input-group-lg -->
            </form>
            <!-- FORM GROUP add a category -->
            <form class="formgroup" style="margin-top: 20px;">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="New category"
                  v-model="addCategory"
                  ref="addCategory"
                />
                <div class="input-group-append">
                  <button
                    type="submit"
                    class="btn btn-sm btn-info"
                    @click.prevent="handleAddCategory"
                    style="padding: 0 15px"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="submit"
                class="btn btn-sm btn-info mt-2"
                @click.prevent="showCategories()"
              > {{ categoryManageText }}
              </button>
              <!-- table to display categories -->
              <table class="table table-striped table-fit table-sm" v-if="categoryManageText=='Done'">
                <thead>
                  <tr>
                    <td class="fit"><b>Category</b></td>
                    <td class="fit"><b>Actions</b></td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in categories" :key="item.id" v-cloak>
                    <!-- category -->
                    <td class="fit">
                      <div class="view">
                        {{ item.category }}
                      </div>
                    </td>
                    <!-- actions -->
                    <td class="fit">
                      <section
                        class="btn-group align-self-center"
                        role="group"
                        aria-label="Options"
                      >
                        <button 
                          class="btn btn-sm btn-outline-secondary" 
                          @click.prevent="handleDeleteCategory(item)"
                        >
                          <font-awesome-icon icon="trash" />
                        </button>
                      </section>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>
    </div>

    <DisplayPurchases :key="componentKey" :purchases="this.purchases" :categories="this.categories" />

    <b-form inline>
      <b-form-group>
        <b-form-input>
        </b-form-input>
      </b-form-group>
    </b-form>

  </div>
</template>

<script>
import { auth } from '@/plugins/firebase';
// TODO: make it so users cannot access purchases/budgets pages without logging in, or make it redirect
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import DisplayPurchases from "@/components/DisplayPurchases.vue";

export default {
  name: "Purchases",
  components: {
    Datepicker,
    DisplayPurchases,
  },
  //props: ["categories"],
  watch: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    purchases() {
      return this.$store.getters.purchases;
    },
    categories() {
      return this.$store.getters.categories;
    }
  },
  data() {
    return {
      purchaseLocation: null,
      purchaseAmount: null,
      purchaseCategory: null,
      createdAt: new Date(),
      addCategory: null,

      editMode: false,
      editedPurchase: null,
      editedPurchaseDate: null,

      componentKey: null,

      // edit categories
      categoryManageText: "Manage categories"
    };
  },
  created() {
  },
  methods: {
    // TODO: Migrate adding purchase to use Vuex store.
    handleAddPurchase: function() {
      var purchaseObject = {
        "purchaseLocation": this.purchaseLocation,
        "purchaseAmount": this.purchaseAmount,
        "purchaseCategory": this.purchaseCategory,
        "createdAt": this.createdAt
      };
      this.$store.dispatch("addPurchase", purchaseObject);
      // reset form
      this.purchaseLocation = null;
      this.purchaseAmount = null;
      this.purchaseCategory = null;
      this.createdAt = purchaseObject.createdAt;
    },
    handleAddCategory: function() {
      // this.$emit("addCategory", this.addCategory)
      // this.addCategory = null;
      this.$store.dispatch("addCategory", this.addCategory);
      this.addCategory = null;
    },
    formatDate(date) {
      return moment(date).format('MMM Do, YYYY');
    },
    editPurchase(purchase) {
      this.editMode = true;
      this.editedPurchase = purchase;
      this.editedPurchaseDate = purchase.createdAt.toDate();
    },

    // categories
    showCategories() {
      console.log("currentuser" + auth.currentUser);
      if (this.categoryManageText == "Done") this.categoryManageText = "Manage categories";
      else this.categoryManageText = "Done";
    },
    handleDeleteCategory(item) {
      this.$store.dispatch("deleteCategory", item);
    },
  },
};
</script>

<style scoped>
.purchases {
  margin: 25px;
}
</style>
