<template>
  <div class="container">
    <div class="head">
      <el-form ref="form" :inline="true" :model="query" label-width="80px">
        <el-form-item label="设备名称">
          <el-input
            v-model="query.deviceName"
            clearable
            placeholder="请输入设备名称"
            size="small"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="user.role == 'teacher'||user.role=='admin'" label="租借人">
          <el-input
            v-model="query.userName"
            clearable
            placeholder="请输入租界人姓名"
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

    <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['monitor:job:edit']"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['monitor:job:remove']"
            >删除</el-button
          >
        </el-col> -->

    <el-card class="box-card">
      <el-table
        v-loading="loading"
        border
        ref="multipleTable"
        :data="borrowData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column align="center" prop="name" label="名称" width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="borrowTime"
          label="租借日期"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="duration"
          label="租借时长"
          width="120"
        ></el-table-column>
        <el-table-column
          v-if="user.role != 'student'"
          align="center"
          prop="userName"
          label="租借人"
          width="140"
        >
        </el-table-column>
        <el-table-column align="center" prop="remark" label="描述" width="260">
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格" width="140">
        </el-table-column>
        <el-table-column align="center" prop="labName" label="实验室" width="140" v-if="user.role=='admin'">
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">
              <el-tag type="success">待审核</el-tag>
            </div>
            <div v-if="scope.row.status == 2">
              <el-tag type="success"> 已租借</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" v-if="user.role!='student'">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 2"
              size="mini"
              type="warning"
              @click="handleReturn(scope.row.deviceId)"
              >归还</el-button
            >
            <el-button
              disabled
              v-if="scope.row.status == 1"
              size="mini"
              type="warning"
              @click="handleReturn(scope.row.deviceId)"
              >归还</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="remind(scope.row.phone)"
              >提醒归还</el-button
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
import { queryBorrow, returnDevice } from "@/api/student";
import { remindReturn } from "@/api/teacher";
export default {
  data() {
    return {
      query: {
        deviceName: "",
        userName: "",
      },
      queryParams: {
        pageCount: 1,
        pageSize: 10,
        param: "",
      },
      borrowParams: {
        userId: Number,
        deviceId: Number,
      },
      total: 0,
      borrowData: [],
      loading: false,
      user: {},
      userId:'',
      labId:''
    };
  },
  created() {
    this.loading = true;
    setTimeout(() => {
      this.getList();
    }, 1000);
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.user = user;
    this.borrowParams.userId = user.id;
    this.userId=user.id
    if (user.labId == null) {
      this.labId = 0;
    } else {
      this.labId = user.labId;
    }
  },
  methods: {
    resetQuery() {
      this.query.deviceName = "";
      this.query.userName = "";
    },
    getList() {
      if (this.user.role == "student") {
        this.queryParams.param =
          this.query.deviceName + "," + this.query.userName;
        queryBorrow(this.queryParams, this.borrowParams.userId,this.labId).then((res) => {
          this.borrowData = res.data;
          console.log(this.borrowData);
          this.total = res.total;
          this.loading = false;
        });
      } else {
        this.queryParams.param =
          this.query.deviceName + "," + this.query.userName;
        queryBorrow(this.queryParams, 0,this.labId).then((res) => {
          this.borrowData = res.data;
          console.log(this.borrowData);
          this.total = res.total;
          this.loading = false;
        });
      }
    },
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
    remind(val) {
      this.$confirm("是否确定提醒归还设备?", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        remindReturn(val).then((res) => {
          console.log(val)
          if (res.data == 0) {
            this.$notify({
              title: "成功",
              message: res.message,
              type: "success",
            });
          } else {
            this.$notify({
              title: "警告",
              message: res.message,
              type: "warning",
            });
          }
        });
      });
    },
    handleReturn(val) {
      this.$confirm("是否确定归还设备?", "归还", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          returnDevice(val,this.userId).then((res) => {
            if (res.data == true) {
              setTimeout(() => {
                this.$notify({
                  title: "成功",
                  message: res.message,
                  type: "success",
                });
                this.getList();
              }, 1000);
            } else {
              setTimeout(() => {
                this.$notify({
                  title: "失败",
                  message: res.message,
                  type: "warning",
                });
                this.getList();
              }, 1000);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消归还",
          });
        });
    },
  },
};
</script>

<style scoped>
.head {
  margin-top: 25px;
  margin-left: 25px;
}
.opt {
  margin-left: 34px;
  margin-bottom: 25px;
}
.box-card {
  margin-left: 25px;
  width: 100%;
}
</style>

