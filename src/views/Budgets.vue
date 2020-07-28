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
        <p>{{ budget.budgetAmount }}</p>
        <p>{{ budget.budgetCategory }}</p>
      </div>
      <b-progress height="2rem" :value="value" show-progress class="mb-2"></b-progress>
      <b-progress :value="value" show-progress class="mb-3"></b-progress>
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

  },
  data() {
    return {
      value: 75,
      budgetCategory: null,
      budgetAmount: null,
    }
  },
  methods: {
    handleAddBudget() {
      this.$emit("addBudget", this.budgetAmount, this.budgetCategory);
      this.budgetAmount = null;
      this.budgetCategory = null;
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