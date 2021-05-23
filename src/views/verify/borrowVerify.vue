<template>
  <div class="container">
    <div class="head">
      <el-form
        ref="form"
        :inline="true"
        :model="queryParams"
        label-width="80px"
      >
        <el-form-item label="设备名称">
          <el-input
            v-model="queryParams.param.deviceName"
            clearable
            placeholder="请输入设备名称"
            size="small"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input
            v-model="queryParams.param.userName"
            clearable
            placeholder="请输入申请人姓名"
            size="small"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getList"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-card class="box-card">
      <el-table
        v-loading="loading"
        border
        ref="multipleTable"
        :data="verifyData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceName"
          label="设备名称"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="buyTime"
          label="租借日期"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="number" label="数量" width="140">
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格" width="140">
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="设备描述"
          width="140"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="userName"
          label="申请人"
          width="140"
        >
        </el-table-column>
        <el-table-column
          v-if="user.role == 'admin'"
          align="center"
          prop="labName"
          label="实验室"
          width="140"
        >
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleSure(scope.row.deviceId, 2, scope.row.userId)"
              >同意</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleRefuse(scope.row.deviceId, 3, scope.row.userId)"
              >不同意</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="total > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageCount"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { queryDeviceBorrow, verifyBorrow } from "@/api/teacher";
export default {
  data() {
    return {
      queryParams: {
        param: {
          deviceName: "",
          userName: "",
        },
        pageCount: 1,
        pageSize: 10,
      },
      loading: false,
      total: 0,
      verifyData: [],
      userId: "",
      labId: "",
      user: {},
    };
  },
  created() {
    this.loading = true;
    setTimeout(() => {
      this.getList();
    }, 1000);
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.userId = user.id;
    if (user.labId == null) {
      this.labId = 0;
    } else {
      this.labId = user.labId;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.loading = true;
      this.queryParams.pageSize = val;
      setTimeout(() => {
        this.getList();
      }, 1000);
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.queryParams.pageCount = val;
      setTimeout(() => {
        this.getList();
      }, 1000);
    },
    getList() {
      (this.loading = true),
        setTimeout(() => {
          queryDeviceBorrow(this.queryParams, this.labId).then((res) => {
            console.log(res);
            this.verifyData = res.data;
            this.total = res.total;
            this.loading = false;
          });
        }, 1000);
    },
    handleSure(deviceId, status, userId) {
      this.$confirm("是否确认同意租借该设备?", "审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          verifyBorrow(deviceId, status, userId).then((res) => {
            this.loading = true;
            console.log(res);
            setTimeout(() => {
              this.$notify({
                title: "成功",
                message: res.message,
                type: "success",
              });
              this.getList();
            }, 1000);
          });
        })
        .catch(() => {
          this.getList();
        });
    },
    handleRefuse(deviceId, status, userId) {
      this.$confirm("是否确认拒绝租借该设备?", "审核", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          verifyBorrow(deviceId, status, userId).then((res) => {
            console.log(res);
            this.loading = true;
            setTimeout(() => {
              this.$notify({
                title: "成功",
                message: res.message,
                type: "success",
              });
              this.getList();
            }, 1000);
          });
        })
        .catch(() => {
          this.getList();
        });
    },

    resetQuery() {
      this.queryParams.param = {};
    },
  },
};
</script>

<style  scoped>
.head {
  margin-top: 25px;
  margin-left: 25px;
}
.box-card {
  margin-left: 25px;
  width: 100%;
}
</style>