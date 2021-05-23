<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
    :labId="labId"
  ></div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { statisticsBorrow, statisticsReturn } from "@/api/teacher";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "200px",
    },
    labId: {
      type: Number,
    },
  },
  watch: {
    labId(val) {
      console.log(this.labId);
      this.frush();
    },
  },
  data() {
    return {
      chart: null,
      borrow: [],
      return: [],
      all: [],
      a: 1,
    };
  },
  async beforeMount() {
    await statisticsReturn(this.labId).then((res) => {
      this.return = res.data;
      console.log(this.return);
    });
    await statisticsBorrow(this.labId).then((res) => {
      this.borrow = res.data;
      console.log(this.borrow);
    });
    var b = this.borrow;
    var r = this.return;
    var result = this.return.map(function (index, item) {
      return index + b[item];
    });
    this.all = result;
    console.log(this.all);
    await this.initChart();
    console.log(this.labId);
  },

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    async frush() {
      await statisticsReturn(this.labId).then((res) => {
        this.return = res.data;
        console.log(this.return);
      });
      await statisticsBorrow(this.labId).then((res) => {
        this.borrow = res.data;
        console.log(this.borrow);
      });
      var b = this.borrow;
      var r = this.return;
      var result = this.return.map(function (index, item) {
        return index + b[item];
      });
      this.all = result;
      console.log(this.all);
      await this.initChart();
      console.log(this.labId);
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      const xData = (function () {
        const data = [];
        for (let i = 1; i < 13; i++) {
          data.push(i + "月");
        }
        return data;
      })();
      this.chart.setOption({
        backgroundColor: "#344b58",
        title: {
          text: "statistics",
          x: "20",
          top: "20",
          textStyle: {
            color: "#fff",
            fontSize: "22",
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "16",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            textStyle: {
              color: "#fff",
            },
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: "#fff",
          },
        },
        legend: {
          x: "5%",
          top: "10%",
          textStyle: {
            color: "#90979c",
          },
          data: ["租借", "归还", "总数"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#90979c",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitArea: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            data: xData,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#90979c",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            splitArea: {
              show: false,
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5",
            },
            textStyle: {
              color: "#fff",
            },
            borderColor: "#90979c",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          {
            name: "租借",
            type: "bar",
            stack: "total",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
              normal: {
                color: "rgba(255,144,128,1)",
                label: {
                  show: true,
                  textStyle: {
                    color: "#fff",
                  },
                  position: "insideTop",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            // data: [
            //   709,
            //   1917,
            //   2455,
            //   2610,
            //   1719,
            //   1433,
            //   1544,
            //   3285,
            //   5208,
            //   3372,
            //   2484,
            //   4078,
            // ],
            data: this.borrow,
          },

          {
            name: "归还",
            type: "bar",
            stack: "total",
            itemStyle: {
              normal: {
                color: "rgba(0,191,183,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            // data: [
            //   327,
            //   1776,
            //   507,
            //   1200,
            //   800,
            //   482,
            //   204,
            //   1390,
            //   1001,
            //   951,
            //   381,
            //   220,
            // ],
            data: this.return,
          },
          {
            name: "总数",
            type: "line",
            stack: "total",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              normal: {
                color: "rgba(252,230,48,1)",
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: "top",
                  formatter(p) {
                    return p.value > 0 ? p.value : "";
                  },
                },
              },
            },
            // data: [
            //   1036,
            //   3693,
            //   2962,
            //   3810,
            //   2519,
            //   1915,
            //   1748,
            //   4675,
            //   6209,
            //   4323,
            //   2865,
            //   4298,
            // ],
            data: this.all,
          },
        ],
      });
    },
  },
};
</script>