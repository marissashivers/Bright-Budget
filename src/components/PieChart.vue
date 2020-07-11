<template>
    <div class="small">
        <pie-chart :chart-data="datacollection"></pie-chart>
    </div>
</template>

<script>
import PieChart from "./PieChart.js";

export default {
    name: "PieChartComponent",
    inheritAttrs: false,
    props: ["purchases", "categories"],
    components: {
        PieChart,
    },
    // copied from Bar Chart
    computed: {
        categoriesToString() {
            var v = [];
            this.categories.forEach(item => v.push(item.category))
            return v;
        },
        purchasesByCategory() {
            var result = this.groupBy(this.purchases, 'purchaseCategory');

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
    data () {
        return {
            datacollection: null
        }
    },
    mounted () {
        this.fillData()
    },
    methods: {
        fillData () {
            this.datacollection = { 
                labels: this.categoriesToString,
                datasets: [
                    {
                        label: 'Purchases',
                        backgroundColor: this.generateBgColorArray(),
                        data: this.purchasesByCategory
                    }
                ]
            }
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
            var length = this.categoriesToString.length;
            for (var i = 0; i < length; i++) {
                // generate random color
                arr.push("#"+((1<<24)*Math.random()|0).toString(16));
            }
            return arr;
        }
    }
}
</script>

<style scoped>
</style>