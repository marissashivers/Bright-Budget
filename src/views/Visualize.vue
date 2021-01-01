<template>
  <div class="container">
    <div class="buttons-container">
      <h1 class="font-weight-light text-center">Visualize your spending habits</h1>
      <button :disabled="currentPurchaseFilter=='lastMonth'" type="button" class="btn btn-outline-primary" @click="filterPresetButtonHandle(1)">Last Month</button>
      <button :disabled="currentPurchaseFilter=='lastThreeMonths'" type="button" class="btn btn-outline-primary" @click="filterPresetButtonHandle(3)">Last 3 Months</button>
      <button :disabled="currentPurchaseFilter=='lastYear'" type="button" class="btn btn-outline-primary" @click="filterPresetButtonHandle(12)">Last 365 Days</button>
      <button :disabled="currentPurchaseFilter=='custom'" type="button" class="btn btn-outline-primary" @click="filterCustomDates()">Custom</button>
      
      <!-- Custom date filter -- only display if user clicked "custom" -->
      <b-card v-if="currentPurchaseFilter=='custom'" bg-variant="light" class="custom-container">
        <form>
          <div class="form-row">
            <div class="col">
              <label>Start date</label>
              <datepicker v-model="customStart" class="form-control" />
            </div>
            <div class="col">
              <label>End date</label>
              <datepicker v-model="customEnd" class="form-control" />
            </div>
          </div>
          <button class="btn btn-primary" @click="customDateCancel()">Cancel</button>
          <button class="btn btn-primary" @click="customDateOk()">OK</button>
        </form>
      </b-card>
    </div>

    <h4 class="font-weight-light text-center" style="text-align:center;">Dates displayed: {{ formatDate(this.startDateDisplay) }} to {{ formatDate(this.endDateDisplay) }}</h4>

    <!-- BOOTSTRAP VUE GRID SYSTEM -->
    <b-container>
      <!-- first row -->
      <b-row>
        <b-col>
            <b-card title="Spending habits over time" body-class="text-center" border-variant="primary" bg-variant="light">
            <LineChart :data="this.chartDataLine" :options="this.chartOptionsLine"></LineChart>
          </b-card>
        </b-col>
      </b-row>
      <!-- second row -->
      <b-row>
        <b-col>
            <b-card border-variant="primary" bg-variant="light">
            <BarChart :data="this.chartDataBar" :options="this.chartOptionsBar"></BarChart>
          </b-card>
        </b-col>
        <b-col>
            <b-card body-class="text-center" border-variant="primary" bg-variant="light">
            <PieChart :data="this.chartDataPie" :options="this.chartOptionsPie"></PieChart>
          </b-card>
        </b-col>
      </b-row>
    </b-container>


  </div>
</template>

<script>
//import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import { mapGetters } from 'vuex';
import Datepicker from "vuejs-datepicker";
import PieChart from "@/components/PieChart.vue";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/LineChart.vue";

import { filterPurchasesByDate, getPurchasesByCategory } from './purchaseFilters.js';

export default {
  name: 'Visualize',
  inheritAttrs: false,
  //props: ["user"],
  components: {
    Datepicker,
    PieChart,
    BarChart,
    LineChart,
  },
  created: function() {
    this.fetchData();
  },
  mounted() {
    this.purchasesFiltered = this.getPurchases;
    this.fetchData();
    this.filterPresetButtonHandle(1);
  },
  computed: {
    ...mapGetters(['isUserAuth', 'getUser', 'getCategories', 'getPurchases']),
  },
  watch: {
    purchasesFiltered() {
      this.fetchData();
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

      purchasesFiltered: ['null'],
      currentPurchaseFilter: 'lastMonth',

      startDateDisplay: new Date(),
      endDateDisplay: new Date(),

      customStart: new Date(),
      customEnd: new Date(),

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
    fetchData() {
      var categoriesMap = getPurchasesByCategory(this.purchasesFiltered, this.getCategories);
      /*******************
       * Data for Pie Chart
      ********************/
      this.chartDataPie = {
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
      /*******************
       * Options for Pie Chart
      ********************/
      this.chartOptionsPie =  {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          //text: 'Pie Chart: Purchases by Category',
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
      /*******************
       * Options for Bar Chart
      ********************/
      this.chartOptionsBar = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          //text: "Bar chart: Purchases by Category"
        }
      }
      /*******************
       * Data for Bar Chart
      ********************/
      this.chartDataBar = {
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
      /*******************
       * Options for Line Chart
      ********************/
      this.chartOptionsLine = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            ticks: {
              reverse: true,
            }
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
      var purchasesMap = this.getPurchasesByDay(this.purchasesFiltered);
      /*******************
       * Data for Line Chart
      ********************/
      this.chartDataLine = {
        labels: Array.from(purchasesMap.keys()).reverse(),
        datasets: [
          {
            label: "Dollars spent",
            backgroundColor: "#59ff85",
            data: Array.from(purchasesMap.values()).reverse(),
          },
        ]
      }
    }, // end fetchData()
    formatDate(date) {
      return moment(date).format('MMM Do, YYYY');
    },
    // ***Action to perform if a preset date filter is clicked 
    filterPresetButtonHandle(numMonths) {
      var end = new Date();
      var start = new Date();
      start.setMonth(start.getMonth() - numMonths);
      this.startDateDisplay = start;
      this.endDateDisplay = end;
      if (numMonths == 1) this.currentPurchaseFilter = "lastMonth";
      else if (numMonths == 3) this.currentPurchaseFilter = "lastThreeMonths";
      else this.currentPurchaseFilter = "lastYear";
      this.purchasesFiltered = filterPurchasesByDate(this.getPurchases, start, end);
      var map = this.getPurchasesByDay(this.purchasesFiltered);
      this.fetchData(map);
    },
    // ***Actions to perform if the custom date filter is clicked.
    filterCustomDates() {
      this.currentPurchaseFilter = 'custom';
    },
    customDateCancel() {
      this.currentPurchaseFilter = '_';
    },
    customDateOk() {
      this.startDateDisplay = this.customStart;
      this.endDateDisplay = this.customEnd;
      this.currentPurchaseFilter = '_'
      this.purchasesFiltered = filterPurchasesByDate(this.getPurchases, this.customStart, this.customEnd);
      var map = this.getPurchasesByDay(this.purchasesFiltered);
      this.fetchData(map);
    },

    // PIE CHART EXPERIMENTATION
    categoriesToString() {
      var v = [];
      this.getCategories.forEach(item => v.push(item.category))
      return v;
    },
    getPurchasesByDay(purchasesToMap) {
      // TODO: fix this section so it works with just one purchase / just one day
      var end = this.endDateDisplay;
      //var start = purchasesToMap[0].createdAt.toDate();
      var start = this.startDateDisplay;
      var daysArray =  this.enumerateDaysBetweenDates(start, end);

      var purchMap = new Map();
      daysArray.forEach(day => {
        purchMap.set(day, 0);
      });
      purchasesToMap.forEach(purch => {
        var purchDate = purch.createdAt.toDate();
        purchDate = purchDate.toDateString();
        purchMap.set(purchDate, Math.round(100*(purchMap.get(purchDate) + purch.purchaseAmount))/100);
      });
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
  },
}
</script>

<style scoped>
  button {
    margin-right: 15px;
  }
  .buttons-container {
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 20px;
  }
  .custom-container {
    margin: 20px 250px;
  }
</style>