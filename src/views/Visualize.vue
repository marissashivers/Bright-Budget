<template>
  <div class="container">
    <div class="buttons">
      <button type="button" class="btn btn-outline-primary" @click="filterLastMonth()">Last Month</button>
      <button type="button" class="btn btn-outline-primary" @click="filterLastThreeMonths()">Last 3 Months</button>
      <button type="button" class="btn btn-outline-primary" @click="filterLastYear()">Last 365 Days</button>
      <button type="button" class="btn btn-outline-primary">Custom</button>
    </div>

    <h3 style="text-align:center;">Dates displayed: {{ formatDate(this.start) }} to {{ formatDate(this.end) }}</h3>

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
//import BarChartComponent from "@/components/BarChart.vue";
//import PieChartComponent from "@/components/PieChart.vue";
import PieChart2 from "@/components/PieChart2.vue";
import BarChart2 from "@/components/BarChart2.vue";
import LineChart from "@/components/LineChart.vue";

export default {
  name: 'Visualize',
  inheritAttrs: false,
  props: ["user", "purchases", "categories"],
  components: {
    //BarChartComponent,
    //PieChartComponent,
    PieChart2,
    BarChart2,
    LineChart,
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
      selectedDate: new Date(),
      search: null,
      purchasesFiltered: this.purchases,

      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }),

      // DATE FILTERING
      end: new Date(),
      start: this.purchases[this.purchases.length-1].createdAt.toDate(),

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
    fetchData: function() {
      var categoriesMap = this.getPurchasesByCategory();
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
      var purchMap = this.getPurchasesByDay()
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
    filterLastYear() {
      this.end = new Date();
      this.start = new Date();
      this.start.setFullYear(this.start.getFullYear() - 1);
      var results = this.purchases.filter(purch => {
        let date = purch.createdAt.toDate();
        return date >= this.start && date <= this.end;
      });
      this.purchasesFiltered = results;
      this.fetchData();
    },

    // PIE CHART EXPERIMENTATION
    categoriesToString() {
      var v = [];
      this.categories.forEach(item => v.push(item.category))
      return v;
    },
    getPurchasesByCategory() {
      var categoriesArray = [];
      this.categories.forEach(item => categoriesArray.push(item.category));
      var categoriesMap = new Map();

      categoriesArray.forEach(cat => {
        categoriesMap.set(cat, 0);
      });

      this.purchasesFiltered.forEach(purch => {
        var purchCat = purch.purchaseCategory;
        categoriesMap.set(purchCat, Math.round(100*(categoriesMap.get(purchCat) + purch.purchaseAmount))/100);
      })
      return categoriesMap;
    },
    getPurchasesByDay() {
      // var purchMap = new Map();
      // this.purchasesFiltered.forEach(purch => {
      //   var purchDate = purch.createdAt.toDate();
      //   purchDate = purchDate.toDateString();
      //   if (!purchMap.has(purchDate)) {
      //     purchMap.set(purchDate, purch.purchaseAmount);
      //   }
      //   else {
      //     //purchMap[purchDate] += purch.purchaseAmount;
      //     purchMap.set(purchDate, purchMap.get(purchDate) + purch.purchaseAmount);
      //   }
      // })
      // return Array.from(purchMap.values());
      var end = new Date();
      var start = this.purchasesFiltered[this.purchasesFiltered.length-1].createdAt.toDate();
      var daysArray =  this.enumerateDaysBetweenDates(start, end);

      var purchMap = new Map();
      daysArray.forEach(day => {
        purchMap.set(day, 0);
      });
      this.purchasesFiltered.forEach(purch => {
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