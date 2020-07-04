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

    <!-- <h2>Testing Purchase List Test:</h2>
    <p v-for="purchase in db" :key="purchase.id">
      {{ purchase.purchasedAt }}
    </p> -->






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
        purchaseAmount: null
      }
    },
    methods: {
      handleAddPurchase: function() {
            this.$emit("addPurchase", this.purchaseLocation, this.purchaseAmount);
            this.purchaseLocation = null;
            this.purchaseAmount = null;
            this.$refs.purchaseLocation.focus();
      }
    }
  }
</script>