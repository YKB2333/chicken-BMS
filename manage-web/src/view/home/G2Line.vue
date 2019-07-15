<template>
  <div id="c1"></div>
</template>

<script>
import { get, post } from "../../libs/axios-cfg";
const moment = require("moment");
const DataSet = require("@antv/data-set");
const G2 = require("@antv/g2");

export default {
  data() {
    return {
      chart: null
    };
  },
  created(){

  },
  mounted() {
    this.drawChart();
  },
  // 监听API接口传过来的数据 使用watch  2018-08-21更新
  // watch: {
  // charData: function (val, oldVal) {    // 监听charData，当发生变化时，触发这个回调函数绘制图表
  // console.log('new: %s, old: %s', val, oldVal);
  // this.drawChart(val);
  // }
  //   },
  methods: {
    drawChart: function() {
      // 2019.03.30 更新 destory方法已被废弃
      // this.chart && this.chart.destory()
      var data = [
        {
          year: "1986",
          ACME: 162,
          Compitor: 42
        },
        {
          year: "1987",
          ACME: 134,
          Compitor: 54
        },
        {
          year: "1988",
          ACME: 116,
          Compitor: 26
        },
        {
          year: "1989",
          ACME: 122,
          Compitor: 32
        },
        {
          year: "1990",
          ACME: 178,
          Compitor: 68
        },
        {
          year: "1991",
          ACME: 144,
          Compitor: 54
        }
      ];
      var dv = new DataSet.View().source(data);
      dv.transform({
        type: "fold",
        fields: ["ACME", "Compitor"],
        key: "type",
        value: "value"
      });
      var chart = new G2.Chart({
        container: "c1",
        forceFit: true,
        height: window.innerHeight
      });
      chart.source(dv, {
        value: {
          alias: "The Share Price in Dollars",
          formatter: function formatter(val) {
            return "$" + val;
          }
        },
        year: {
          range: [0, 1]
        }
      });
      chart.tooltip({
        crosshairs: true
      });
      chart
        .area()
        .position("year*value")
        .color("type")
        .shape("smooth");
      chart
        .line()
        .position("year*value")
        .color("type")
        .size(2)
        .shape("smooth");
      chart.render();
    }
  }
};
</script>

<style scoped>
</style>
