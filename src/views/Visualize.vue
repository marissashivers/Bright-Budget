<template>
  <div class="container">

    <hr />

    <h2>Purchases...</h2>
    <b-input-group class="w-25">
        <label>Filter by month</label>
        <datepicker class="form-control" v-model="selectedDate" placeholder="select date" :minimumView="'month'" :maximumView="'month'" >Select Date</datepicker>
    </b-input-group>

    <h3>Your purchases for {{ formatDate(selectedDate) }}:</h3>
    <div v-for="purchase in db" :key="purchase.id">
        <div v-if="formatDate(purchase.createdAt.toDate()) == formatDate(selectedDate)"> {{ purchase.purchasedAt }} @ {{ moment(purchase.createdAt.toDate()).format('MMM Do YYYY') }}</div>
    </div>

    <!-- Purchase List VUE component -->
    <PurchaseList></PurchaseList>

    <br />
    <br />
    <br />
    <hr />

    <h1>Demo examples of vue-chartjs</h1>
    <!-- LINE CHART -->
    <h3>Line Chart</h3>
    <line-chart></line-chart>

  </div>
</template>

<script>
// @ is an alias to /src
import Datepicker from 'vuejs-datepicker';
import { purchaseCollection } from '../firebase';
import moment from 'moment';
import PurchaseList from '@/components/PurchaseList.vue'
import LineChart from '@/components/LineChart.vue'

export default {
    name: 'Visualize',
    components: {
        Datepicker,
        PurchaseList,
        LineChart,
    },
    computed: {
    },
    data() {
        return {
            purchase: null,
            dbToDisplay: [],
            selectedDate: new Date(),
            search: null,
        }
    },
    firestore() {
        return {
            db: purchaseCollection.orderBy('createdAt', 'desc'),
            dbToDisplay: purchaseCollection.where('createdAt', '==', 'selectedDateFormatted')
        }
    },
    methods: {
        formatDate(date) {
            return moment(date).format('MMM YYYY');
        },
        getColor(price) {
            if (price > 50) return 'red'
            else if (price < 10) return 'yellow'
            else return 'green'
        },
    },
}
</script>

<style scoped>
    .container {
        padding-left: 300px;
        padding-right: 300px;
    }
</style>