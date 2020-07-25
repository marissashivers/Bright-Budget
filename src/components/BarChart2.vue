<script>
import { Bar } from "vue-chartjs";
export default {
    extends: Bar,
    props: ["data", "options"],
    mounted() {
        this.renderChart(this.data, this.options)
    },
    watch: {
        data: function() {
            this.renderChart(this.data, this.options);
        }
    },
    computed: {
    },
    methods: {
    }
}
</script>

<style scoped>
</style>