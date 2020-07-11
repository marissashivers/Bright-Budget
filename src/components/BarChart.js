import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

// Exporting this so it can be used in other components
export default {
    extends: Bar,
    mixins: [reactiveProp],
    props: ['options'],
    mounted() {
        this.renderChart(this.chartdata, this.options);
    },
}