<template>
  <div class="chart-container">
    <el-button v-if="user.role == 'admin'" type="success">选择实验室</el-button>
    <el-select v-if="user.role == 'admin'" v-model="labId" placeholder="请选择">
      <el-option
        v-for="dict in labData"
        :key="dict.name"
        :label="dict.name"
        :value="dict.id"
      >
      </el-option>
    </el-select>
    <chart height="100%" width="100%" :labId="labId" />
  </div>
</template>

<script>
import Chart from "@/components/Charts/MixChart";
import { getLab } from "@/api/teacher";
export default {
  name: "MixChart",
  components: { Chart },
  data() {
    return {
      user: {},
      labId: 1,
      labData: [],
    };
  },
  created() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.user = user;

    getLab().then((res) => {
      // console.log(res.data)
      this.labData = res.data;
      console.log(this.labData);
    });
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>