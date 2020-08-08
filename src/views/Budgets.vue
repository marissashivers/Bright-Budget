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
                  <option value="null" disabled hidden>Category</option>
                  <option v-for="item in categories" :key="item.id" :disabled="currentBudgetsArray.includes(item.category)">
                    {{ item.category }} <span v-if="currentBudgetsArray.includes(item.category)">(already exists)</span>
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
            <tr v-for="item in budgets" :key="item.id" :class="{editing: item == editedBudget && editMode == true}" v-cloak>
              <!-- budget category -->
              <td class="fit">
                <div class="view">
                  {{ item.budgetCategory }}
                </div>
                <div class="edit">
                  <select
                    name="budgetCategory"
                    class="form-control"
                    v-model="item.budgetCategory"
                    aria-describedby="buttonAdd"
                    ref="budgetCategory"
                  >
                    <option value="null" disabled hidden>Category</option>
                    <option v-for="item in categories" :key="item.id">
                      {{ item.category }}
                    </option>
                  </select>
                </div>
              </td>
              <!-- budget amount -->
              <td class="fit">
                <div class="view">
                  ${{ Number(item.budgetAmount).toFixed(2) }}
                </div>
                <div class="edit">
                  <input
                    type="text"
                    class="form-control"
                    name="budgetAmount"
                    placeholder="Amount"
                    aria-describedby="buttonAdd"
                    v-model="item.purchaseAmount"
                    ref="purchaseAmount"
                  />
                </div>
              </td>
              <!-- actions -->
              <td class="fit">
                <section
                  class="btn-group align-self-center"
                  role="group"
                  aria-label="Budget Options"
                >
                  <button 
                    class="btn btn-sm btn-outline-secondary view"
                    @click="editBudget(item)"
                  >
                    <font-awesome-icon icon="pencil-alt" />
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary edit"
                    @click="handleSaveBudget(item)"
                  >
                    <font-awesome-icon icon="save"></font-awesome-icon>
                  </button>
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

    <div class="row justify-content-center">
      <span class="glyphicon glyphicon-menu-left">
        <button @click="getLastMonthPurchases(dateReference)">
          <font-awesome-icon icon="arrow-left" size="2x" />
        </button>
      </span>
      <span style="margin-left:10px; margin-right:10px;">
        <h3>{{ moment(dateReference).format("MMMM YYYY") }}</h3>
      </span>
      <span>
        <button @click="getNextMonthPurchases(dateReference)">
          <font-awesome-icon icon="arrow-right" size="2x" />
        </button>
      </span>
    </div>

    <div class="budget-container">
      <b-card bg-variant="light">
        <template v-slot:header>
          <h4 class="mb-0">Your Budgets:</h4>
        </template>
        <div v-for="budget in this.budgets" :key="budget.id">
          <h4>{{ budget.budgetCategory }}: ${{ categoriesMap.get(budget.budgetCategory).toFixed(2) }} / ${{ budget.budgetAmount.toFixed(2) }} <span v-if="categoriesMap.get(budget.budgetCategory) > budget.budgetAmount">(EXCEEDED!)</span></h4>
          <b-progress height="2rem" :value="categoriesMap.get(budget.budgetCategory)" :max="budget.budgetAmount" :variant="computeVariant(categoriesMap.get(budget.budgetCategory), budget.budgetAmount)" show-value class="mb-3"></b-progress>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Budgets',
  computed: {
    purchases() {
      return this.$store.getters.purchases;
    },
    categories() {
      return this.$store.getters.categories;
    },
    budgets() {
      return this.$store.getters.budgets;
    },
  },
  mounted() {
    this.purchasesFiltered = this.getCurrentMonthPurchases();
    this.currentBudgetsArray = this.getCurrentBudgetsArray();
    this.categoriesMap = this.getPurchasesByCategory();
  },
  watch: {
    // update currentBudgetsArray whenever budgets are changed, in order to update enabled/disabled category selection
    budgets: function() {
      this.currentBudgetsArray = this.getCurrentBudgetsArray();
    },
    purchasesFiltered: function() {
      this.categoriesMap = this.getPurchasesByCategory();
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
    }
  },
  methods: {
    handleAddBudget() {
      var budgetObject = {
        "budgetAmount": this.budgetAmount,
        "budgetCategory": this.budgetCategory
      };
      this.$store.dispatch("addBudget", budgetObject);
      // reset form
      this.budgetAmount = null;
      this.budgetCategory = null;
    },
    // key -> category
    // value -> amount
    // uses purchasesFiltered array when mapping values
    getPurchasesByCategory() {
      var categoriesArray = [];
      this.categories.forEach(item => categoriesArray.push(item.category));
      var map = new Map();

      categoriesArray.forEach(cat => {
        map.set(cat, 0);
      });

      this.purchasesFiltered.forEach(purch => {
        var purchCat = purch.purchaseCategory;
        map.set(purchCat, Math.round(100*(map.get(purchCat) + purch.purchaseAmount))/100);
      })
      return map;
    },
    getCurrentBudgetsArray() {
      var arr = [];
      this.budgets.forEach(item => {
        arr.push(item.budgetCategory);
      })
      return arr;
    },
    computeVariant(amountSpent, budgetAmount) {
      if (amountSpent > budgetAmount) return "danger";
      else return "info";
    },
    getCurrentMonthPurchases() {
      var date = new Date();
      this.dateReference = date;
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      var results = this.purchases.filter(purch => {
        let date = purch.createdAt.toDate();
        return date >= firstDay && date <= lastDay;
      })
      // console.log(firstDay);
      // console.log(lastDay);
      return results;
    },
    getLastMonthPurchases(prevDate) {
      // go back one month
      var date = new Date(prevDate.getTime());
      date.setMonth(date.getMonth() - 1);
      this.dateReference = date;
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      var results = this.purchases.filter(purch => {
        let date = purch.createdAt.toDate();
        return date >= firstDay && date <= lastDay;
      })
      this.purchasesFiltered = results;
    },
    getNextMonthPurchases(prevDate) {
      // go forward one month
      var date = new Date(prevDate.getTime());
      date.setMonth(date.getMonth() + 1);
      this.dateReference = date;
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      var results = this.purchases.filter(purch => {
        let date = purch.createdAt.toDate();
        return date >= firstDay && date <= lastDay;
      })
      // console.log(firstDay);
      // console.log(lastDay);
      this.purchasesFiltered = results;
    },
    formatDate(date) {
      return moment(date).format('MMM Do, YYYY');
    },
    // editing and deleting
    editBudget(purchase) {
      this.editMode = true;
      this.editBudget = purchase;
    },
    handleSaveBudget(purchase) {
      purchase.createdAt = this.editedBudgeDateDate;
      this.editMode = false;
    },
    handleDeleteBudget(budgetObject) {
      this.$store.dispatch("deleteBudget", budgetObject);
    },
    showBudgets() {
      if (this.buttonManageText == "Done") this.buttonManageText = "Manage my budgets";
      else this.buttonManageText = "Done";
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
</style>