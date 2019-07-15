<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="12">
                        <label>时间范围: </label>
                        <DatePicker v-model="search.dateRange" format="yyyy-MM-dd" type="daterange"
                                    placement="bottom-end"
                                    placeholder="选择时间范围" style="width: 400px"></DatePicker>
                    </Col>
                    <Col span="6">
                        <label>集市: </label>
                        <Select v-model="search.marketId" style="width:200px" placeholder="请选择集市" clearable>
                            <Option v-for="maket in option.markets" :value="maket.id" :key="maket.id">{{ maket.name }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                    </Col>
                </Row>
            </div>
            <div class="margin-right-10 margin-left-10" style="width: 100%;overflow: hidden">
                <v-chart :forceFit="true" :height="chart.height" :data="chartData" :scale="chart.scale" style="width: 80%;display: inline-flex;float: left">
                    <v-tooltip/>
                    <v-axis/>
                    <v-legend/>
                    <v-smooth-line position="date*count" color="chookCls" shape="smooth"/>
                    <v-point position="date*count" color="chookCls" shape="chookCls"/>
                </v-chart>

            </div>
        </Card>
    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";

    const moment = require("moment");
    const DataSet = require('@antv/data-set');

    export default {
        name: "statistics",
        data() {
            return {
                option: {
                    markets: []
                },
                search: {
                    dateRange: [moment().subtract(15, 'days').format('YYYY-MM-DD'), moment().add(2, 'days').format("YYYY-MM-DD")],
                    startDate: null,
                    endDate: null,
                    marketId: null,
                },
                chart: {
                    height: 400,
                    fields: ['Tokyo', 'London'],
                    datas: [
                        {month: 'Jan', Tokyo: 7.0, London: 3.9},
                        {month: 'Feb', Tokyo: 6.9, London: 4.2},
                        {month: 'Mar', Tokyo: 9.5, London: 5.7},
                        {month: 'Apr', Tokyo: 14.5, London: 8.5},
                        {month: 'May', Tokyo: 18.4, London: 11.9},
                        {month: 'Jun', Tokyo: 21.5, London: 15.2},
                        {month: 'Jul', Tokyo: 25.2, London: 17.0},
                        {month: 'Aug', Tokyo: 26.5, London: 16.6},
                        {month: 'Sep', Tokyo: 23.3, London: 14.2},
                        {month: 'Oct', Tokyo: 18.3, London: 10.3},
                        {month: 'Nov', Tokyo: 13.9, London: 6.6},
                        {month: 'Dec', Tokyo: 9.6, London: 4.8},
                    ],
                    scale: [{
                        dataKey: 'month',
                        min: 0,
                        max: 1,
                    }]
                }
            }
        },
        created() {
            this.queryAllMarket();
        },
        computed: {
            chartData() {
                let dv = new DataSet.View().source(this.chart.datas);
                dv.transform({
                    type: 'fold',
                    fields: this.chart.fields,
                    key: 'chookCls',
                    value: 'count',
                });
                return dv.rows;
            }
        },
        methods: {
            handleSearch() {
                if (!this.search.dateRange || this.search.dateRange.length != 2) {
                    this.$Message.error("请选择时间范围");
                    return;
                }
                if (!this.search.marketId) {
                    this.$Message.error("请选择集市");
                    return;
                }
                this.querySubStatData();
            },
            async queryAllMarket() {
                try {
                    let res = await get("api/pomelomgm/market/list/all");
                    if (res.status == 1) {
                        this.option.markets = res.data;
                        this.search.marketId = res.data[0].id;
                        this.querySubStatData();
                    } else {
                        this.option.markets = [];
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async querySubStatData() {
                this.search.startDate = this.search.dateRange[0];
                this.search.endDate = this.search.dateRange[1];
                try {
                    let res = await post("api/pomelomgm/subscribe/stat", this.search);
                    if (res.status == 1) {
                        this.chart.fields = res.data.fields;
                        this.chart.datas = res.data.datas;
                    } else {
                        this.chart.fields = [];
                        this.chart.datas = [];
                    }
                } catch (e) {
                    this.$throw(e);
                }
            }
        }
    }
</script>

<style scoped>

</style>
