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

    <div class="flex-container">
        <div class="small">
            <BarChart2 :data="this.chartDataBar" :options="this.chartOptionsBar"></BarChart2>
        </div>
        <div class="small">
            <PieChart2 :data="this.chartDataPie" :options="this.chartOptionsPie"></PieChart2>
        </div>
    </div>
<!--
    <h3>Bar Chart</h3>
    <BarChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></BarChartComponent>

    <h3>Pie Chart</h3>
    <PieChartComponent v-bind:purchases="this.purchases" v-bind:categories="this.categories"></PieChartComponent>
    -->

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

            // Pie Chart
            chartOptionsPie: null,
            chartDataPie: null,

            // Bar chart
            chartOptionsBar: null,
            chartDataBar: null,

            // Line chart
            chartOptionsLine: null,
            chartDataLine: null,
        }
    },
    firestore() {
        return {
            db: purchaseCollection.orderBy('createdAt', 'desc'),
        }
    },
    methods: {
        fetchData: function() {
            this.chartDataPie = {
                labels: this.categoriesToString(),
                datasets: [
                    {
                        label: 'Purchases',
                        backgroundColor: this.generateBgColorArray(),
                        data: this.getPurchasesByCategory()
                    }
                ]
            }
            this.chartOptionsPie =  {
                title: {
                    display: true,
                    text: 'Pie Chart: Purchases by Category',
                    maintainAspectRatio: false,
                },
                legend: {
                    display: true,
                    position: "right",
                },
                // tooltip display percentage: https://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                            var total = meta.total;
                            var currentValue = dataset.data[tooltipItem.index];
                            var percentage = parseFloat((currentValue/total*100).toFixed(1));
                            return currentValue + ' (' + percentage + '%)';
                        },
                        title: function(tooltipItem, data) {
                            return data.labels[tooltipItem[0].index];
                        }
                    }
                },
            },
            this.chartOptionsBar = {
                title: {
                    display: true,
                    text: "Bar chart: Purchases by Category"
                }
            },
            this.chartDataBar = {
                labels: this.categoriesToString(),
                datasets: [
                    {
                        label: "Purchases",
                        backgroundColor: "green",
                        data: this.getPurchasesByCategory()
                    }
                ]
            },
            this.chartOptionsLine = {
            },
            this.chartDataLine = {
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
        getPurchasesByCategory() {
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
        getPurchasesByDay() {
        },
        getPurchasesByMonth() {
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
            var colors = ["#3267cc",
                        "#dc402b",
                        "#f49831",
                        "#47971a",
                        "#9b3c99",
                        "#3999c6",
                        "#dd4777",
                        "#66aa0f",
                        "#b8352e",
                        "#316395",
                        "#994499",
                        "#4bab99",
                        "#aaaa1f",
                        "#6840cc",
                        "#e4742d",
                        "#8c2618",
                        "#662567",
                        "#429362",
                        "#5574a6",
                        "#3b3eac"];
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
        padding-left: 50px;
        padding-right: 50px;
    }
    .small {
        width: 500px;
    }
    /* flex */
    .flex-container {
        display: flex;
        background-color: white;
        flex-wrap: wrap;
    }
    .flex-container > div {
        background-color: white;
        margin: 10px;
        padding: 20px;
        font-size: 30px;
        /* https://www.cssmatic.com/box-shadow */
        -webkit-box-shadow: 2px 2px 17px 2px rgba(0,0,0,0.2);
        -moz-box-shadow: 2px 2px 17px 2px rgba(0,0,0,0.2);
        box-shadow: 2px 2px 17px 2px rgba(0,0,0,0.2);
    }
</style>