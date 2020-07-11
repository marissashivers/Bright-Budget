<template>
  <div class="container">

    <h1>Demo examples of vue-chartjs</h1>
    <h3>Line Chart</h3>

    <BarChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></BarChartComponent>

    <br />
    <br />
    <h3>Pie Chart</h3>
    <PieChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></PieChartComponent>


  </div>
</template>

<script>
// @ is an alias to /src
//import Datepicker from 'vuejs-datepicker';
import { purchaseCollection } from '../firebase';
import moment from 'moment';
import BarChartComponent from "@/components/BarChart.vue";
import PieChartComponent from "@/components/PieChart.vue";

export default {
    name: 'Visualize',
    inheritAttrs: false,
    props: ["user", "purchases", "categories"],
    components: {
        BarChartComponent,
        PieChartComponent,
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