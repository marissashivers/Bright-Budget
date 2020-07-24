<template>
  <div class="container">
    <button type="button" class="btn btn-outline-primary" @click="filterLastMonth()">Last Month</button>
    <button type="button" class="btn btn-outline-primary">Last 3 Months</button>
    <button type="button" class="btn btn-outline-primary">Last 365 Days</button>
    <button type="button" class="btn btn-outline-primary">Custom</button>

    <br />
    <br />
    <br />

    <h3>Line Chart</h3>
    <BarChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></BarChartComponent>

    <h3>Pie Chart</h3>
    <PieChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></PieChartComponent>

    <h4>filter by date</h4>
    <PieChart2 :data="this.chartData" :options="this.chartOptions"></PieChart2>

  </div>
</template>

<script>
// @ is an alias to /src
//import Datepicker from 'vuejs-datepicker';
import { purchaseCollection } from '../firebase';
import moment from 'moment';
import BarChartComponent from "@/components/BarChart.vue";
import PieChartComponent from "@/components/PieChart.vue";
import PieChart2 from "@/components/PieChart2.vue";

export default {
    name: 'Visualize',
    inheritAttrs: false,
    props: ["user", "purchases", "categories"],
    components: {
        BarChartComponent,
        PieChartComponent,
        PieChart2,
    },
    computed: {
        // PIE CHART TESTING
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
                totals.push(catTotal);
            }
            return totals;
        },
    },
    data() {
        return {
            purchase: null,
            selectedDate: new Date(),
            search: null,
            purchasesFiltered: this.purchases,

            // PIE CHART TESTING
            chartOptions: {
                title: {
                    display: true,
                    text: 'Purchases by Category'
                },
            },
            chartData: {
                labels: () => this.categoriesToString(),
                datasets: [
                    {
                        label: "Purchases",
                        backgroundColor: () => this.generateBgColorArray(),
                        data: () => this.purchasesByCategory(),
                    }
                ]
            },
        }
    },
    firestore() {
        return {
            db: purchaseCollection.orderBy('createdAt', 'desc'),
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
        filterLastMonth() {
            console.log(this.purchasesFiltered);
            var today = new Date();
            var lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth()-1);
            var results = this.purchases.filter(purch => {
                let date = purch.createdAt.toDate();
                return date >= lastMonth && date <= today;
            });
            this.purchasesFiltered = results;
            console.log(this.purchasesFiltered);
        },

        // PIE CHART EXPERIMENTATION
        fillData() {
            this.chartData = [
                
            ]
        },
        groupBy(array, key) {
            const result = {};
            this.categoriesToString.forEach(ca => {
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
            var length = this.categoriesToString.length;
            for (var i = 0; i < length; i++) {
                // generate random color
                arr.push(colors[i]);
            }
            return arr;
        }
    },
}
</script>

<style scoped>
    .container {
        padding-left: 300px;
        padding-right: 300px;
    }
</style>