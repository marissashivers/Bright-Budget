<template>
  <div class="budgets">
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <h1
          class="font-weight-light text-center"
        >Add a Montly Budget</h1>
        <div class="card bg-light">
          <div class="card-body text-center">
            <form class="formgroup">
              <div class="input-group input-group-lg">
                <!-- budget category -->
                <select
                  name="budgetCategory"
                  class="form-control"
                  v-model="budgetCategory"
                  aria-describedby="buttonAdd"
                  ref="budgetCategory"
                >
                <!--
                  <option value="null" disabled hidden>Category</option>
                  <option v-for="item in this.getCategories" :key="item.id" :disabled="this.getBudgets.includes(item.category)">
                    {{ item.category }} <span v-if="this.getBudgets.includes(item.category)">(already exists)</span>
                  </option>     
                  -->
                  <option value="null" disabled hidden>Category</option>
                  <option v-for="cat in this.getCategories" :key="cat.id">
                    {{ cat.category }}
                  </option>
                </select>
                <!-- budget amount -->
                <input
                  type="text"
                  class="form-control"
                  name="budgetAmount"
                  placeholder="Amount"
                  aria-describedby="buttonAdd"
                  v-model="budgetAmount"
                  ref="budgetAmount"
                />
                <!-- submit button for + -->
                <div class="input-group-append">
                  <button
                    type="submit"
                    class="btn btn-sm btn-info"
                    id="buttonAdd"
                    @click.prevent="handleAddBudget()"
                  >
                    +
                  </button>
                </div>
              </div> <!-- input-group input-group-lg -->
            </form> <!-- FORM GROUP -->
          </div> <!-- card-body text-center" -->
        <button class="btn btn-md btn-info" id="buttonManage" @click="showBudgets()">
          {{ buttonManageText }}
        </button>

        <!-- Display and edit budgets -->
        <!-- TODO: allow editing/deleting budgets. Maybe using modal for editing? -->
        <table class="table table-striped table-sm table-fit" v-if="buttonManageText=='Done'">
          <thead>
            <tr>
              <td class="fit">Cateogry</td>
              <td class="fit">Amount</td>
              <td class="fit">Actions</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in this.getBudgets" :key="item.id" :class="{editing: item == editedBudget && editMode == true}" v-cloak>
              <!-- budget category -->
              <td class="fit">
                <div class="view">
                  {{ item.budgetCategory }}
                </div>
              </td>
              <!-- budget amount -->
              <td class="fit">
                <div class="view">
                  ${{ Number(item.budgetAmount).toFixed(2) }}
                </div>
              </td>
              <!-- actions -->
              <td class="fit">
                <section
                  class="btn-group align-self-center"
                  role="group"
                  aria-label="Budget Options"
                >
                <!--
                  <button 
                    class="btn btn-sm btn-outline-secondary view"
                    @click="handleEditBudget(item)"
                  >                  
                    <font-awesome-icon icon="pencil-alt" />
                  </button>
                  -->
                  <button 
                    class="btn btn-sm btn-outline-secondary" 
                    @click="handleDeleteBudget(item)"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </section>
              </td>
            </tr>
          </tbody>
        </table>
        </div> <!-- card bg-light -->
      </div> <!-- col-12 col-md-9 col-lg-7 -->
    </div> <!-- row justify-content center -->

    <!-- EDIT PURCHASE MODAL -->
    <b-modal id="bv-modal-edit">
      <template v-slot:modal-title>
        Edit budget
      </template>
      <div class="d-block text-center">
      </div>
      <template v-slot:modal-footer>
        <button class="btn btn-secondary" @click="$bvModal.hide('bv-modal-edit')">Cancel</button>
        <button class="btn btn-primary" @click="handleSaveBudget(currentlyEditingBudget)">Save Changes</button>
      </template>
      <b-form-group
        label="Amount"
        label-for="amount-input"
        invalid-feedback="Amount is required"
      >
        <b-form-input
          v-model="editBudgetAmount"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Category"
        label-for="category-input"
        invalid-feedback="Category is required"
      >
        <select
          class="form-control"
          v-model="editBudgetCategory"
          aria-describedby="buttonAdd"
          ref="budgetCategory"
        >
          <option value="null" disabled hidden>Category</option>
          <option v-for="item in this.getCategories" :key="item.id">
            {{ item.category }}
          </option>
        </select>
      </b-form-group>
    </b-modal>
    
    <div class="budget-container">
      <b-card bg-variant="light">
        <template v-slot:header> 
          <div style="text-align:center;">
            <span class="glyphicon glyphicon-menu-left">
              <!-- <button @click="getLastMonthPurchases(dateReference)">
                <font-awesome-icon icon="arrow-left" size="2x" />
              </button> -->
            </span>
            <span style="display:inline-block; font-size:large">
              <b-button-toolbar>
                <button @click="getLastMonthPurchases(dateReference)">
                  <font-awesome-icon icon="arrow-left" size="2x" />
                </button>
                <b-input-group>
                  <datepicker 
                    :minimumView="'month'" 
                    :maximumView="'year'" 
                    :initialView="'month'" 
                    :format="'MMMM yyyy'" 
                    placeholder="date" 
                    v-model="dateReference"
                    class="transparent-input centered text-center"
                    style="margin-left:4em"
                  >
                  </datepicker>
                </b-input-group>
                <button @click="getNextMonthPurchases(dateReference)">
                  <font-awesome-icon icon="arrow-right" size="2x" />
                </button>
              </b-button-toolbar>
             <!-- {{ moment(dateReference).format("MMMM YYYY") }} -->
              <!-- <datepicker :minimumView="'month'" :maximumView="'year'" :initialView="'month'" :format="'MMMM yyyy'" placeholder="date">
              </datepicker> -->
            </span>
            <span>
              <!-- <button @click="getNextMonthPurchases(dateReference)">
                <font-awesome-icon icon="arrow-right" size="2x" />
              </button> -->
            </span>
          </div>
        </template>
        <div v-for="budget in this.getBudgets" :key="budget.id">
          <h4>
            {{ budget.budgetCategory }}: ${{ categoriesMap.get(budget.budgetCategory) }} / ${{ parseFloat(budget.budgetAmount).toFixed(2) }} 
            <span v-if="parseFloat(categoriesMap.get(budget.budgetCategory)) > parseFloat(budget.budgetAmount)">
              (EXCEEDED!)
            </span>
          </h4>
          <b-progress 
            height="2rem" 
            :value="categoriesMap.get(budget.budgetCategory)" 
            :max="budget.budgetAmount" 
            :variant="computeVariant(categoriesMap.get(budget.budgetCategory), budget.budgetAmount)" 
            show-value 
            class="mb-3" />
        </div>
      </b-card>
    </div>    

  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import Datepicker from "vuejs-datepicker";

export default {
  name: 'Budgets',
  components: {
    Datepicker,
  },
  computed: {
    ...mapGetters(['getUser', 'getPurchases', 'getBudgets', 'getCategories', 'isUserAuth']),
  },
  mounted() {
    this.purchasesFiltered = this.getCurrentMonthPurchases();
    //this.currentBudgetsArray = this.getCurrentBudgetsArray();
    this.categoriesMap = this.getPurchasesByCategory();
  },
  watch: {
    // update currentBudgetsArray whenever budgets are changed, in order to update enabled/disabled category selection
    // budgets: function() {
    //   this.currentBudgetsArray = this.getCurrentBudgetsArray();
    // },
    purchasesFiltered: function() {
      this.categoriesMap = this.getPurchasesByCategory();
    },
    dateReference: function() {
      console.log("date changed");
      // TODO: add logic here that updates the budgets displayed for the selected month
    }
  },
  data() {
    return {
      budgetCategory: null,
      budgetAmount: null,
      categoriesMap: new Map(),
      currentBudgetsArray: [],
      purchasesFiltered: [],
      dateReference: new Date(),
      //editing
      buttonManageText: "Manage your budgets",
      editedBudget: null,
      editedBudgeDateDate: null,
      editMode: false,
      currentlyEditingBudget: null,
      editBudgetAmount: 0,
      editBudgetCategory: "",
    }
  },
  methods: {
    ...mapActions(['addBudgetAction', 'deleteBudgetAction']),
    handleAddBudget() {
      this.addBudgetAction({
        "budgetAmount": this.budgetAmount,
        "budgetCategory": this.budgetCategory
      });
      // reset form
      this.budgetAmount = null;
      this.budgetCategory = null;
    },
    handleDeleteBudget(budgetObject) {
      this.deleteBudgetAction(budgetObject.id);
    },
    // key -> category
    // value -> amount
    // uses purchasesFiltered array when mapping values
    getPurchasesByCategory() {
      var categoriesArray = [];
      this.getCategories.forEach(item => categoriesArray.push(item.category));
      var map = new Map();

      categoriesArray.forEach(cat => {
        map.set(cat, 0);
      });

      this.purchasesFiltered.forEach(purch => {
        var purchCat = purch.purchaseCategory;
        map.set(purchCat, (parseFloat(map.get(purchCat)) + parseFloat(purch.purchaseAmount)).toFixed(2));
      })

      return map;
    },
    // getCurrentBudgetsArray() {
    //   var arr = [];
    //   this.budgets.forEach(item => {
    //     arr.push(item.budgetCategory);
    //   })
    //   return arr;
    // },
    computeVariant(amountSpent, budgetAmount) {
      if (parseFloat(amountSpent) > parseFloat(budgetAmount)) return "danger";
      else return "info";
    },
    getCurrentMonthPurchases() {
      var date = new Date();
      this.dateReference = date;
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      lastDay.setHours(23,59,59,999);
      var results = this.getPurchases.filter(purch => {
        let date = purch.createdAt.toDate();
        return date >= firstDay && date <= lastDay;
      })
      console.log(firstDay);
      console.log(lastDay);
      console.log("results");
      console.log(this.getPurchases);
      console.log(results);
      return results;
    },
    getLastMonthPurchases(prevDate) {
      // go back one month
      var date = new Date(prevDate.getTime());
      date.setDate(0);
      this.dateReference = date;
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      lastDay.setHours(23,59,59,999);
      var results = this.getPurchases.filter(purch => {
        let date = purch.createdAt.toDate();
        return date >= firstDay && date <= lastDay;
      })
      this.purchasesFiltered = results;
      return results;
    },
    getNextMonthPurchases(prevDate) {
      // go forward one month
      var date = new Date(prevDate.getTime());
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
      this.dateReference = date;
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      lastDay.setHours(23,59,59,999);
      var results = this.getPurchases.filter(purch => {
        let date = purch.createdAt.toDate();
        return date >= firstDay && date <= lastDay;
      })
      this.purchasesFiltered = results;
      return results;
    },
    formatDate(date) {
      return moment(date).format('MMM Do, YYYY');
    },
    // editing
    showBudgets() {
      if (this.buttonManageText == "Done") this.buttonManageText = "Manage my budgets";
      else this.buttonManageText = "Done";
    },
    handleEditBudget(budget) {
      this.$bvModal.show('bv-modal-edit');
      this.currentlyEditingBudget = budget;
      this.editBudgetAmount = budget.budgetAmount;
      this.editBudgetCategory = budget.budgetCategory;
    },
    handleSaveBudget(budget) {
      budget.budgetCategory = this.editBudgetCategory;
      budget.budgetAmount = Number(this.editBudgetAmount);
      this.$store.dispatch("editAndSaveBudget", budget);
      this.$bvModal.hide('bv-modal-edit');
    },
  }, // end methods

}
</script>

<style scoped>
  .budgets {
    margin: 25px;
  }
  .budget-container {
    margin-top: 50px;
    margin-left: 200px;
    margin-right: 200px;
  }
  #buttonManage {
    margin: 10px auto;
    display: block;
  }
  .table-fit,
  .table td.fit, 
  .table th.fit {
    white-space: nowrap;
    width: 50%;
  }
  .table-fit {
    margin-left: auto;
    margin-right: auto;
  }
  /* for date display and arrows to next/last dates */
  .transparent-input{
       background-color:rgba(255, 0, 0, 0) !important;
       border:black !important;
    }
    
</style>