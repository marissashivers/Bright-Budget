<template>
  <div class="purchases">
    <p>Using the PersonGreeter in components folder...</p>
    <PersonGreeter personName="Travis" />

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

    <h2>Add purchase component</h2>
    <AddPurchase></AddPurchase>
    <p>==========================</p>



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
          <td>{{ item.createdAt }}</td>
          <td>{{ item.purchaseLocation }}</td>
          <td>{{ item.purchaseAmount }}</td>
          <td>{{ item.purchaseCategory }}</td>
          <td><button @click="handleDeletePurchase(item)">Delete</button></td>
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


    <h2>From LinkedIn learning testing...:</h2>

    <!-- adding a purchase -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7">
        <h1
          class="font-weight-light text-center"
        >Add a Purchase</h1>

        <div class="card bg-light">
          <div class="card-body text-center">
            <form class="formgroup">
              <div class="input-group input-group-lg">
                <input
                  type="text"
                  class="form-control"
                  name="purchaseLocation"
                  placeholder="Purchase location"
                  aria-describedby="buttonAdd"
                  v-model="purchaseLocation"
                  ref="purchaseLocation"
                />
                <input
                  type="text"
                  class="form-control"
                  name="purchaseAmount"
                  placeholder="Purchase amount"
                  aria-describedby="buttonAdd"
                  v-model="purchaseAmount"
                  ref="purchaseAmount"
                />
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- display list of elements -->
    <div class="row justify-content-center">
      <div class="col-11 col-md-8 col-lg-6">
        <div class="card border-top-0 rounded-0">
          <div class="card-body py-2">
            <h4 class="card-title m-0 text-center">Your Purchases</h4>
          </div>
          <div class="list-group list-group-flush">
            <div
              class="list-group-item d-flex"
              v-for="item in purchases"
              :key="item.id"
            >
              <section
                class="btn-group align-self-center"
                role="group"
                aria-label="Purchase Options"
              >
                <button
                  class="btn btn-sm btn-outline-secondary"
                  title="Delete Meeting"
                  @click="$emit('deleteMeeting', item.id)"
                >
                  <font-awesome-icon icon="trash" />
                </button>

                <router-link
                  class="btn btn-sm btn-outline-secondary"
                  title="Check In"
                  to="/"
                >
                  <font-awesome-icon icon="link" />
                </router-link>

                <router-link
                  class="btn btn-sm btn-outline-secondary"
                  title="Attendees"
                  to="/"
                >
                  <font-awesome-icon icon="list-ul" />
                </router-link>
              </section>

              <section class="pl-3 text-left align-self-center">
                {{ item.purchaseLocation }}
                {{ item.purchaseAmount }}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
  import PersonGreeter from '../components/PersonGreeter.vue'
  import AddPurchase from '@/components/AddPurchase.vue'
  
  export default {
    name: 'purchases',
    components: {
      PersonGreeter,
      AddPurchase,
    },
    props: ["user", "purchases"],
    data() {
      return {
        purchaseLocation: null,
        purchaseAmount: null,

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
            this.$emit("addPurchase", this.purchaseLocation, this.purchaseAmount);
            this.purchaseLocation = null;
            this.purchaseAmount = null;
            this.$refs.purchaseLocation.focus();
      },
      handleDeletePurchase(purchase) {
        this.$emit("deletePurchase", purchase.id)
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
      }
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