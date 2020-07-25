<template>
  <div class="container">
    <button type="button" class="btn btn-outline-primary" @click="filterLastMonth()">Last Month</button>
    <button type="button" class="btn btn-outline-primary" @click="filterLastThreeMonths()">Last 3 Months</button>
    <button type="button" class="btn btn-outline-primary">Last 365 Days</button>
    <button type="button" class="btn btn-outline-primary">Custom</button>

    <br />
    <br />
    <br />
    <h4>Dates displayed: {{ formatDate(this.start) }} to {{ formatDate(this.end) }}</h4>

    <div class="small">
        <h3>Bar chart - purchases by category</h3>
        <BarChart2 :data="this.chartDataBar" :options="this.chartOptionsBar"></BarChart2>
    </div>
<!--
    <h3>Bar Chart</h3>
    <BarChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></BarChartComponent>

    <h3>Pie Chart</h3>
    <PieChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></PieChartComponent>
    -->

    <div class="small">
        <h4>Pie Chart - purchases by category</h4>
        <PieChart2 :data="this.chartData" :options="this.chartOptions"></PieChart2>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
//import Datepicker from 'vuejs-datepicker';
import { purchaseCollection } from '../firebase';
import moment from 'moment';
//import BarChartComponent from "@/components/BarChart.vue";
//import PieChartComponent from "@/components/PieChart.vue";
import PieChart2 from "@/components/PieChart2.vue";
import BarChart2 from "@/components/BarChart2.vue";

export default {
    name: 'Visualize',
    inheritAttrs: false,
    props: ["user", "purchases", "categories"],
    components: {
        //BarChartComponent,
        //PieChartComponent,
        PieChart2,
        BarChart2,
    },
    created: function() {
        this.fetchData();
    },
    mounted() {
        this.filterLastMonth();
    },
    computed: {
        // PIE CHART TESTING
    },
    data() {
        return {
            purchase: null,
            selectedDate: new Date(),
            search: null,
            purchasesFiltered: this.purchases,

            // DATE FILTERING
            end: new Date(),
            start: new Date(),

            // PIE CHART TESTING
            chartOptions: null,
            chartData: null,

            // Bar chart
            chartDataBar: null,
            chartOptionsBar: null,
        }
    },
    firestore() {
        return {
            db: purchaseCollection.orderBy('createdAt', 'desc'),
        }
    },
    methods: {
        fetchData: function() {
            this.chartData = {
                labels: this.categoriesToString(),
                datasets: [
                    {
                        label: 'Purchases',
                        backgroundColor: this.generateBgColorArray(),
                        data: this.purchasesByCategory()
                    }
                ]
            }
            this.chartOptions =  {
                title: {
                    display: true,
                    text: 'Purchases by Category',
                    maintainAspectRatio: false,
                }
            }
            this.chartDataBar = {
                labels: this.categoriesToString(),
                datasets: [
                    {
                        label: "Purchases",
                        backgroundColor: "green",
                        data: this.purchasesByCategory()
                    }
                ]
            }
        },
        formatDate(date) {
            return moment(date).format('MMM do YYYY');
        },
        filterLastMonth() {
            this.end = new Date();
            this.start = new Date();
            this.start.setMonth(this.start.getMonth()-1);
            var results = this.purchases.filter(purch => {
                let date = purch.createdAt.toDate();
                return date >= this.start && date <= this.end;
            });
            this.purchasesFiltered = results;
            // reset chart data
            this.fetchData();
        },
        filterLastThreeMonths() {
            this.end = new Date();
            this.start = new Date();
            this.start.setMonth(this.start.getMonth()-3);
            var results = this.purchases.filter(purch => {
                let date = purch.createdAt.toDate();
                return date >= this.start && date <= this.end;
            });
            this.purchasesFiltered = results;
            // reset chart data
            this.fetchData();
        },

        // PIE CHART EXPERIMENTATION
        categoriesToString() {
            var v = [];
            this.categories.forEach(item => v.push(item.category))
            return v;
        },
        purchasesByCategory() {
            var result = this.groupBy(this.purchasesFiltered, 'purchaseCategory');
            var totals = [];
            for(var cat in result) {
                // result[cat] to acces array of objects
                // https://gist.github.com/benwells/0111163b3cccfad0804d994c70de7aa1
                var catTotal = result[cat].reduce(function(prev, cur) {
                    return prev + cur.purchaseAmount;
                }, 0);
                totals.push(Number(catTotal).toFixed(2));
            }
            return totals;
        },
        groupBy(array, key) {
            const result = {};
            this.categoriesToString().forEach(ca => {
                result[ca] = [];
            })
            array.forEach(item => {
                if(!result[item[key]]) {
                    result[item[key]] = [];
                }
                result[item[key]].push(item);
            });
            return result;
        },
        generateBgColorArray() {
            var arr = [];
            var colors = ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600"];
            var length = this.categoriesToString().length;
            for (var i = 0; i < length; i++) {
                // generate random color
                arr.push(colors[i]);
            }
            return arr;
        },
    },
}
</script>

<style scoped>
    .container {
        padding-left: 300px;
        padding-right: 300px;
    }
    .small {
        width: 500px;
    }
</style>