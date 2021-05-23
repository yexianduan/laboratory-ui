<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
    :labId="labId"
  />
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
    };
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  async beforeMount() {
    this.frush()
    await statisticsReturn().then((res) => {
      this.return = res.data;
      console.log(this.return);
    });
    await statisticsBorrow().then((res) => {
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
      this.chart.setOption({
        backgroundColor: "#394056",
        title: {
          top: 20,
          text: "Requests",
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#F1F1F3",
          },
          left: "1%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B",
            },
          },
        },
        legend: {
          top: 20,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ["租借", "归还", "总数"],
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "#F1F1F3",
          },
        },
        grid: {
          top: 100,
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#57617B",
              },
            },
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "(%)",
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#57617B",
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14,
              },
            },
            splitLine: {
              lineStyle: {
                color: "#57617B",
              },
            },
          },
        ],
        series: [
          {
            name: "租借",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(137, 189, 27, 0.3)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(137, 189, 27, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: "rgb(137,189,27)",
                borderColor: "rgba(137,189,2,0.27)",
                borderWidth: 12,
              },
            },
            // data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122],
            data: this.borrow,
          },
          {
            name: "归还",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 136, 212, 0.3)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 136, 212, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: "rgb(0,136,212)",
                borderColor: "rgba(0,136,212,0.2)",
                borderWidth: 12,
              },
            },
            // data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150],
            data: this.return,
          },
          {
            name: "总数",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(219, 50, 51, 0.3)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(219, 50, 51, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: "rgb(219,50,51)",
                borderColor: "rgba(219,50,51,0.2)",
                borderWidth: 12,
              },
            },
            // data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122],
            data: this.all,
          },
        ],
      });
    },
  },
};
</script>