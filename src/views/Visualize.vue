<template>
  <div class="container">
    <div class="buttons">
      <button :disabled="currentPurchaseFilter=='lastMonth'" type="button" class="btn btn-outline-primary" @click="filterLastMonth()">Last Month</button>
      <button :disabled="currentPurchaseFilter=='lastThreeMonths'" type="button" class="btn btn-outline-primary" @click="filterLastThreeMonths()">Last 3 Months</button>
      <button :disabled="currentPurchaseFilter==' lastYear'" type="button" class="btn btn-outline-primary" @click="filterLastYear()">Last 365 Days</button>
      <button type="button" class="btn btn-outline-primary">Custom</button>
    </div>

    <h3 style="text-align:center;">Dates displayed: {{ formatDate(this.purchasesDates[0]) }} to {{ formatDate(this.purchasesDates[1]) }}</h3>

    <!-- Bootstrap Grid System -->
    <div class="row">
      <div class="col-sm">
        <LineChart :data="this.chartDataLine" :options="this.chartOptionsLine"></LineChart>
      </div>
    </div>
    <div class="row">
      <div class="col-sm">
        <BarChart2 :data="this.chartDataBar" :options="this.chartOptionsBar"></BarChart2>
      </div>
      <div class="col-sm">
        <PieChart2 :data="this.chartDataPie" :options="this.chartOptionsPie"></PieChart2>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import { mapGetters } from 'vuex';
//import BarChartComponent from "@/components/BarChart.vue";
//import PieChartComponent from "@/components/PieChart.vue";
import PieChart2 from "@/components/PieChart2.vue";
import BarChart2 from "@/components/BarChart2.vue";
import LineChart from "@/components/LineChart.vue";

// TODO: Update it so the correct dates display when filtering

export default {
  name: 'Visualize',
  inheritAttrs: false,
  //props: ["user"],
  components: {
    //BarChartComponent,
    //PieChartComponent,
    PieChart2,
    BarChart2,
    LineChart,
  },
  created: function() {
    //this.fetchData();
  },
  mounted() {
    this.filterLastMonth();
  },
  computed: {
    ...mapGetters([
      'purchases',
      'categories',
      'purchasesLastMonth',
      'purchasesLastThreeMonths',
      'purchasesLastYear',
      'purchasesByCategory',
    ]),
    purchasesDates() {
      switch(this.currentPurchaseFilter) {
        case 'lastMonth':
          return this.getStartAndEndDates(this.purchasesLastMonth);
        case 'lastThreeMonths':
          return this.getStartAndEndDates(this.purchasesLastThreeMonths);
        case 'lastYear':
          return this.getStartAndEndDates(this.purchasesLastYear);
        default:
          return [];
      }
    }
  },
  data() {
    return {
      selectedDate: new Date(),
      search: null,
      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }),

      currentPurchaseFilter: 'lastMonth',

      // // DATE FILTERING
      // end: new Date(),
      // start: this.purchases[this.purchases.length-1].createdAt.toDate(),

      // Pie Chart
      chartOptionsPie: [],
      chartDataPie: [],

      // Bar chart
      chartOptionsBar: [],
      chartDataBar: [],

      // Line chart
      chartOptionsLine: [],
      chartDataLine: [],
    }
  },
  methods: {
    fetchData(purchMap) {
      var categoriesMap = this.purchasesByCategory;
      this.chartDataPie = {
        //labels: this.categoriesToString(),
        labels: Array.from(categoriesMap.keys()),
        datasets: [
          {
            label: 'Purchases',
            backgroundColor: this.generateBgColorArray(),
            //data: this.getPurchasesByCategory()
            data: Array.from(categoriesMap.values())
          }
        ]
      }
      this.chartOptionsPie =  {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Pie Chart: Purchases by Category',
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
      }
      this.chartOptionsBar = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Bar chart: Purchases by Category"
        }
      }
      this.chartDataBar = {
        //labels: this.categoriesToString(),
        labels: Array.from(categoriesMap.keys()),
        datasets: [
          {
            label: "Purchases",
            backgroundColor: "green",
            //data: this.getPurchasesByCategory()
            data: Array.from(categoriesMap.values())
          }
        ]
      }
      this.chartOptionsLine = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            // ticks: {
            //   maxTicksLimit: 8
            // }
          }],
          title: {
            display: true,
            title: "Time Series"
          },
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
      }
      this.chartDataLine = {
        labels: Array.from(purchMap.keys()).reverse(),
        datasets: [
          {
            label: "Dollars spent",
            backgroundColor: "#59ff85",
            data: Array.from(purchMap.values()).reverse(),
          },
        ]
      }
    }, // end fetchData()
    formatDate(date) {
      return moment(date).format('MMM Do, YYYY');
    },
    filterLastMonth() {
      this.currentPurchaseFilter = 'lastMonth';
      var map = this.getPurchasesByDay(this.purchasesLastMonth);
      this.fetchData(map);
    },
    filterLastThreeMonths() {
      this.currentPurchaseFilter = 'lastThreeMonths';
      var map = this.getPurchasesByDay(this.purchasesLastThreeMonths);
      this.fetchData(map);
    },
    filterLastYear() {
      this.currentPurchaseFilter = 'lastYear';
      var map = this.getPurchasesByDay(this.purchasesLastYear);
      this.fetchData(map);
    },

    // PIE CHART EXPERIMENTATION
    categoriesToString() {
      var v = [];
      this.categories.forEach(item => v.push(item.category))
      return v;
    },
    getPurchasesByDay(purchasesToMap) {
      var end = new Date();
      var start = purchasesToMap[purchasesToMap.length-1].createdAt.toDate();
      var daysArray =  this.enumerateDaysBetweenDates(start, end);

      var purchMap = new Map();
      daysArray.forEach(day => {
        purchMap.set(day, 0);
      });
      purchasesToMap.forEach(purch => {
        var purchDate = purch.createdAt.toDate();
        purchDate = purchDate.toDateString();
        purchMap.set(purchDate, Math.round(100*(purchMap.get(purchDate) + purch.purchaseAmount))/100);
      })
      console.log(end);
      console.log(start);
      console.log(Array.from(purchMap.keys()));

      return purchMap;
    },
    getPurchasesByMonth() {
    },
    // helper functions
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
    enumerateDaysBetweenDates(startDate, endDate) {
      //https://stackoverflow.com/questions/23795522/how-to-enumerate-dates-between-two-dates-in-moment
      var dates = [];
      var currDate = moment(startDate).startOf('day');
      var lastDate = moment(endDate).startOf('day');

      dates.push(currDate.clone().toDate().toDateString());
      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        var temp = currDate.clone().toDate();
        dates.push(temp.toDateString());
        //dates.push(currDate.clone().toDate());
      }
      var today = new Date();
      today = today.toDateString();
      dates.push(today);
      return dates;
    },
    getStartAndEndDates(purchases) {
      // array: [startDate, endDate]
      var dates = [];
      var first = purchases[0].createdAt.toDate();
      var last = purchases[purchases.length - 1].createdAt.toDate();
      if (first < last) {
        dates.push(first);
        dates.push(last);
      }
      else {
        dates.push(last);
        dates.push(first);
      }
      return dates;
    }
  },
}
</script>

<style scoped>
  .container {
    padding-left: 50px;
    padding-right: 50px;
  }
  .buttons {
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 20px;
  }
  .col-sm {
    background-color: white;
    margin: 10px;
    padding: 10px;
    font-size: 30px;
    /* https://www.cssmatic.com/box-shadow */
    -webkit-box-shadow: 2px 2px 17px 2px rgba(0,0,0,0.2);
    -moz-box-shadow: 2px 2px 17px 2px rgba(0,0,0,0.2);
    box-shadow: 2px 2px 17px 2px rgba(0,0,0,0.2);
  }
</style>