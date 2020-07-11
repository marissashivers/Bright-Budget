import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

// Exporting this so it can be used in other components
export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    props: ['options'],
    mounted() {
        this.renderChart(this.chartdata, this.options);
    },
}