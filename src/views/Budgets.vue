<template>
  <div>

    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <h1
          class="font-weight-light text-center"
        >Add a Montly Budget</h1>
        <div class="card bg-light">
          <div class="card-body text-center">
            <form class="formgroup">
              <div class="input-group input-group-lg">
                <!-- datepicker -->
                <input
                  type="text"
                  class="form-control"
                  name="budgetAmount"
                  placeholder="Amount"
                  aria-describedby="buttonAdd"
                  v-model="budgetAmount"
                  ref="budgetAmount"
                />
                <select
                  name="budgetCategory"
                  class="form-control"
                  v-model="budgetCategory"
                  aria-describedby="buttonAdd"
                  ref="budgetCategory"
                >
                  <option value="null" disabled hidden>Category</option>
                  <option v-for="item in categories" :key="item.id" :disabled="currentBudgetsArray.includes(item.category)">
                    {{ item.category }}
                  </option>
                </select>
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
        </div> <!-- card bg-light -->
      </div> <!-- col-12 col-md-9 col-lg-7 -->
    </div> <!-- row justify-content center -->

    <div class="budget-container">
      <h2>Your Budgets:</h2>
      <div v-for="budget in this.budgets" :key="budget.id">
        <h4>{{ budget.budgetCategory }}: ${{ categoriesMap.get(budget.budgetCategory).toFixed(2) }} / ${{ budget.budgetAmount.toFixed(2) }} <span v-if="categoriesMap.get(budget.budgetCategory) > budget.budgetAmount">(EXCEEDED!)</span></h4>
        <b-progress height="2rem" :value="categoriesMap.get(budget.budgetCategory)" :max="budget.budgetAmount" :variant="computeVariant(categoriesMap.get(budget.budgetCategory), budget.budgetAmount)" show-value class="mb-3"></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Budgets',
  props: ["user", "purchases", "categories", "budgets"],
  components: {

  },
  mounted() {
    this.categoriesMap = this.getPurchasesByCategory();
    this.currentBudgetsArray = this.getCurrentBudgetsArray();
  },
  watch: {
    // update currentBudgetsArray whenever budgets are changed, in order to update enabled/disabled category selection
    budgets: function() {
      this.currentBudgetsArray = this.getCurrentBudgetsArray();
    }
  },
  data() {
    return {
      budgetCategory: null,
      budgetAmount: null,
      categoriesMap: new Map(),
      currentBudgetsArray: [],
    }
  },
  methods: {
    handleAddBudget() {
      this.$emit("addBudget", this.budgetAmount, this.budgetCategory);
      this.budgetAmount = null;
      this.budgetCategory = null;
    },
    getPurchasesByCategory() {
      var categoriesArray = [];
      this.categories.forEach(item => categoriesArray.push(item.category));
      var categoriesMap = new Map();

      categoriesArray.forEach(cat => {
        categoriesMap.set(cat, 0);
      });

      this.purchases.forEach(purch => {
        var purchCat = purch.purchaseCategory;
        categoriesMap.set(purchCat, Math.round(100*(categoriesMap.get(purchCat) + purch.purchaseAmount))/100);
      })
      return categoriesMap;
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
    }
  },
}
</script>

<style scoped>
  .budget-container {
    margin-top: 50px;
    margin-left: 200px;
    margin-right: 200px;
  }
</style>