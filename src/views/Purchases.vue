<template>
  <div>
    <!-- adding a purchase -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <h1 class="font-weight-light text-center">Add a Purchase/Category</h1>
        <div class="card bg-light">
          <div class="card-body text-center">
            <form class="formgroup">
              <div class="input-group input-group-lg">
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
                  >
                    +
                  </button>
                </div>
              </div>
              <!-- input-group input-group-lg -->
            </form>
            <!-- FORM GROUP -->
            <form class="formgroup" style="margin-top: 20px;">
              <div class="input-group input-group-lg">
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
                  >
                    +
                  </button>
                </div>
              </div>
            </form>
          </div>
          <!-- card-body text-center" -->
        </div>
        <!-- card bg-light -->
      </div>
      <!-- col-12 col-md-9 col-lg-7 -->
    </div>
    <!-- row justify-content center -->

    <!-- purchase pagination testing -->
    <!-- <table class="table table-striped">
      <thead>
        <tr>
          <td>Date</td>
          <td>Location</td>
          <td>Amount</td>
          <td>Category</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in purchases"
          :key="item.id"
          :class="{ editing: item == editedPurchase && editMode == true }"
          v-cloak
        >
          <td>
            <div class="view">
              {{ formatDate(item.createdAt.toDate()) }}
            </div>
            <div class="edit">
              <datepicker v-model="editedPurchaseDate" class="form-control">
              </datepicker>
            </div>
          </td>
          <td>
            <div class="view">
              {{ item.purchaseLocation }}
            </div>
            <div class="edit">
              <input
                type="text"
                class="form-control"
                name="purchaseLocation"
                placeholder="Location"
                aria-describedby="buttonAdd"
                v-model="item.purchaseLocation"
                ref="purchaseLocation"
              />
            </div>
          </td>
          <td>
            <div class="view">
              ${{ Number(item.purchaseAmount).toFixed(2) }}
            </div>
            <div class="edit">
              <input
                type="text"
                class="form-control"
                name="purchaseAmount"
                placeholder="Amount"
                aria-describedby="buttonAdd"
                v-model="item.purchaseAmount"
                ref="purchaseAmount"
              />
            </div>
          </td>
          <td>
            <div class="view">
              {{ item.purchaseCategory }}
            </div>
            <div class="edit">
              <select
                name="purchaseCategory"
                class="form-control"
                v-model="item.purchaseCategory"
                aria-describedby="buttonAdd"
                ref="purchaseCategory"
              >
                <option value="null" disabled hidden>Category</option>
                <option v-for="item in categories" :key="item.id">
                  {{ item.category }}
                </option>
              </select>
            </div>
          </td>
          <td>
            <section
              class="btn-group align-self-center"
              role="group"
              aria-label="Purchase Options"
            >
              <button
                class="btn btn-sm btn-outline-secondary view"
                @click="editPurchase(item)"
              >
                <font-awesome-icon icon="pencil-alt" />
              </button>
              <button
                class="btn btn-sm btn-outline-secondary edit"
                @click="handleSavePurchase(item)"
              >
                <font-awesome-icon icon="save"></font-awesome-icon>
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="handleDeletePurchase(item)"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </section>
          </td>
        </tr>
      </tbody>
    </table> -->

    <!-- Page Navigation
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item">
          <button
            type="button"
            class="page-link"
            v-if="page != 1"
            @click="page--"
          >
            Previous
          </button>
        </li>
        <li class="page-item">
          <button
            type="button"
            class="page-link"
            v-for="pageNumber in pages.slice(page - 1, page + 5)"
            :key="pageNumber"
            @click="page = pageNumber"
          >
            {{ pageNumber }}
          </button>
        </li>
        <li class="page-item">
          <button
            type="button"
            @click="page++"
            v-if="page < pages.length"
            class="page-link"
          >
            Next
          </button>
        </li>
      </ul>
    </nav> -->

    <DisplayPurchases :key="componentKey" :purchases="this.purchases" :categories="this.categories" />

  </div>
</template>

<script>
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import DisplayPurchases from "@/components/DisplayPurchases.vue";

export default {
  name: "Purchases",
  components: {
    Datepicker,
    DisplayPurchases,
  },
  props: ["categories"],
  watch: {
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    purchases() {
      return this.$store.getters.purchases;
    },
  },
  data() {
    return {
      purchaseLocation: null,
      purchaseAmount: null,
      purchaseCategory: null,
      createdAt: new Date(),
      addCategory: null,
      page: 1,
      perPage: 10,
      pages: [],

      editMode: false,
      editedPurchase: null,
      editedPurchaseDate: null,

      componentKey: null,
    };
  },
  created() {
    // this.getPurchases();
    // this.setPages();
  },
  methods: {
    handleAddPurchase: function() {
      this.$emit("addPurchase", this.purchaseLocation, this.purchaseAmount, this.purchaseCategory, this.createdAt);
      this.purchaseLocation = null;
      this.purchaseAmount = null;
      this.purchaseCategory = null;
      this.createdAt = new Date();
    },
    handleSavePurchase(purchase) {
      purchase.createdAt = this.editedPurchaseDate;
      this.editMode = false;
      this.$emit("savePurchase", purchase);
    },
    handleDeletePurchase(purchase) {
      this.$emit("deletePurchase", purchase.id)
    },
    handleAddCategory: function() {
      this.$emit("addCategory", this.addCategory)
      this.addCategory = null;
    },
    getPurchases() {
      return this.purchases;
    },
    setPages() {
      let numberofPages = Math.ceil(this.purchases.length / this.perPage);
      this.pages = [];
      for(let index = 1; index <= numberofPages; index++) {
        this.pages.push(index);
      }
    },
    paginate() {
      let page = this.page;
      let perPage = this.perPage;
      let from = (page * perPage) - perPage;
      let to = (page * perPage);
      return this.purchases.slice(from, to);
    },
    formatDate(date) {
      return moment(date).format('MMM Do, YYYY');
    },
    editPurchase(purchase) {
      this.editMode = true;
      this.editedPurchase = purchase;
      this.editedPurchaseDate = purchase.createdAt.toDate();
    },
  },
};
</script>

<style scoped>
button.page-link {
  display: inline-block;
}

button.page-link {
  font-size: 20px;
  color: #29b3ed;
  font-weight: 500;
}

[v-cloak] {
  display: none;
}

.edit {
  display: none;
}

.editing .edit {
  display: block;
}

.editing .view {
  display: none;
}
</style>
