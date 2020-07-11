<template>
  <div>

    <!-- adding a purchase -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <h1
          class="font-weight-light text-center"
        >Add a Purchase/Category</h1>
        <div class="card bg-light">
          <div class="card-body text-center">
            <form class="formgroup">
              <div class="input-group input-group-lg">
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
                <!-- datepicker -->
                <datepicker 
                  v-model="createdAt" 
                  class="form-control">
                </datepicker>
                <!-- submit button for + -->
                <div class="input-group-append">
                  <button
                    type="submit"
                    class="btn btn-sm btn-info"
                    id="buttonAdd"
                    @click.prevent = "handleAddPurchase"
                  >
                    +
                  </button>
                </div>
              </div> <!-- input-group input-group-lg -->
            </form> <!-- FORM GROUP -->
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
                  >+
                  </button>
                </div>
              </div>
            </form>
          </div> <!-- card-body text-center" -->
        </div> <!-- card bg-light -->
      </div> <!-- col-12 col-md-9 col-lg-7 -->
    </div> <!-- row justify-content center -->

    <!-- purchase pagination testing -->
    <table class="table table-striped">
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
        <tr v-for="item in displayedPurchases" :key="item.id">
          <td>{{ formatDate(item.createdAt.toDate()) }}</td>
          <td>{{ item.purchaseLocation }}</td>
          <td>${{ item.purchaseAmount }}</td>
          <td>{{ item.purchaseCategory }}</td>
          <td>
            <section
              class="btn-group align-self-center"
              role="group"
              aria-label="Purchase Options"
            >
              <button 
                class="btn btn-sm btn-outline-secondary"
              >
                <font-awesome-icon icon="pencil-alt" />
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
    </table>

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <button 
            type="button" 
            class="page-link" 
            v-if="page != 1" 
            @click="page--"
          >Previous
          </button>
        </li>
        <li class="page-item">
          <button 
            type="button" 
            class="page-link" 
            v-for="pageNumber in pages.slice(page-1, page+5)"
            :key="pageNumber"
            @click="page = pageNumber"
          >{{ pageNumber }}
          </button>
        </li>
        <li class="page-item">
          <button 
            type="button" 
            @click="page++" 
            v-if="page < pages.length" 
            class="page-link"
          >Next
          </button>
        </li>
      </ul>
    </nav>
    
  </div>
</template>

<script>
  import moment from 'moment';
  import Datepicker from 'vuejs-datepicker';
  
  export default {
    name: 'purchases',
    components: {
      Datepicker,
    },
    props: ["user", "purchases", "categories"],
    data() {
      return {
        purchaseLocation: null,
        purchaseAmount: null,
        purchaseCategory: null,
        createdAt: new Date(),
        addCategory: null,
        page: 1,
        perPage: 5,
        pages: [],
      }
    },
    computed: {
      rows() {
        return this.purchases.length
      },
      displayedPurchases() {
        return this.paginate();
      }
    },
    watch: {
      purchases() {
        this.setPages();
      }
    },
    created() {
      this.getPurchases();
    },
    methods: {
      handleAddPurchase: function() {
            this.$emit("addPurchase", this.purchaseLocation, this.purchaseAmount, this.purchaseCategory, this.createdAt);
            this.purchaseLocation = null;
            this.purchaseAmount = null;
            this.purchaseCategory = null;
            this.createdAt = null;
            this.$refs.purchaseLocation.focus();
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
    }
  }
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
</style>