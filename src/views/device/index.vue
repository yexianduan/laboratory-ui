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
            v-model="queryParams.param"
            clearable
            placeholder="请输入设备名称"
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
    <div class="opt">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-if="user.role == 'student'"
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >购买申请</el-button
          >
          <el-button
            v-if="user.role == 'admin'||user.role=='teacher'"
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >增加设备</el-button
          >
        </el-col>
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
      </el-row>
    </div>
    <el-card class="box-card">
      <el-table
        v-loading="loading"
        border
        ref="multipleTable"
        :data="deviceData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column align="center" prop="name" label="名称" width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="number"
          label="数量"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="buyTime"
          label="购买日期"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="remark" label="描述" width="260">
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格" width="140">
        </el-table-column>
        <el-table-column
          align="center"
          prop="labName"
          label="实验室"
          width="140"
          v-if="user.role == 'admin'"
        >
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">
              <el-tag type="success">待审核</el-tag>
            </div>
            <div v-if="scope.row.status == 2">
              <el-tag type="success"> 审核通过</el-tag>
            </div>
            <div v-if="scope.row.status == 3">
              <el-tag type="success">已入库</el-tag>
            </div>
            <div v-if="scope.row.status == 4">
              <el-tag type="danger">已拒绝</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.status == 3 && user.role == 'student'"
              size="mini"
              type="info"
              @click="handleBroow(scope.row.id)"
              >借用</el-button
            >
            <el-button
              v-if="scope.row.status == 2 && user.role == 'student'"
              size="mini"
              type="success"
              @click="handleInsert(scope.row.id)"
              >入库</el-button
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

    <!-- dialog  购买申请-->
    <el-dialog title="购买申请" :visible.sync="dialogFormVisible">
      <el-form
        :model="device"
        :rules="deviceRules"
        ref="device"
        label-width="100px"
      >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="device.name" placeholder="输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备数量" prop="number">
          <el-input
            v-model.number="device.number"
            placeholder="输入设备数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="购买时间" prop="buyTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="device.buyTime"
            type="datetime"
            placeholder="选择购买时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备价格" prop="price">
          <el-input
            v-model="device.price"
            placeholder="输入设备价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="实验室" prop="labId">
          <el-select
            v-model="device.labId"
            placeholder="选择实验室"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in labData"
              :key="dict.name"
              :label="dict.name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备描述" prop="remark">
          <el-input
            type="textarea"
            v-model="device.remark"
            placeholder="输入设备描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertDevice('device')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- dialog  修改设备信息-->
    <el-dialog title="修改设备" :visible.sync="dialogFormVisible1">
      <el-form
        :model="device"
        :rules="deviceRules"
        ref="device"
        label-width="100px"
      >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="device.name" placeholder="输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备数量" prop="number">
          <el-input
            v-model.number="device.number"
            placeholder="输入设备数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="购买时间" prop="buyTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="device.buyTime"
            type="datetime"
            placeholder="选择购买时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备价格" prop="price">
          <el-input
            v-model="device.price"
            placeholder="输入设备价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备描述" prop="remark">
          <el-input
            type="textarea"
            v-model="device.remark"
            placeholder="输入设备描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="updateDevice('device')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="填写租借时长" :visible.sync="dialogVisible2">
      <el-form :model="borrow" ref="borrow" label-width="100px">
        <el-form-item
          :rules="[
            { required: true, message: '时长不能为空' },
            { type: 'number', message: '时长必须为数字值' },
          ]"
          label="租借时长"
          prop="duration"
        >
          <el-input
            type="duration"
            v-model.number="borrow.duration"
            placeholder="输入租借时长"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="sure('borrow')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  deviceQuery,
  borrowDevice,
  storeDevice,
  insertDevice,
  updateDevice,
  deleteDevice,
} from "@/api/student";
import { getLab } from "@/api/teacher";
export default {
  data() {
    var checkPrice = (rule, value, callback) => {
      let reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if (value === "") {
        callback(new Error("请输入设备价格"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的单价"));
        }
        callback();
      }
    };
    return {
      dialogVisible2: false,
      queryParams: {
        pageCount: 1,
        pageSize: 10,
        param: "",
      },
      borrow: {
        userId: Number,
        deviceId: Number,
        duration: "",
      },
      device: {
        name: "",
        number: "",
        buyTime: "",
        remark: "",
        price: "",
        labId: "",
        createId: "",
      },
      deviceRules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        labId: [{ required: true, message: "请选择实验室", trigger: "blur" }],
        number: [
          { required: true, message: "请输入设备数量", trigger: "blur" },
          {
            type: "number",
            message: "请输入整数",
          },
        ],
        buyTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        price: [
          { required: true, message: "请输入设备价格", trigger: "blur" },
          { validator: checkPrice, trigger: "blur" },
        ],
      },
      total: 0,
      deviceData: [],
      loading: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      user: {},
      id: "",
      labId: "",
      labData: [],
    };
  },
  created() {
    this.loading = true;
    setTimeout(() => {
      this.getList();
    }, 1000);
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.user = user;
    if (user.labId == null) {
      this.labId = 0;
    } else {
      this.labId = user.labId;
    }
    this.borrow.userId = user.id;
    getLab().then((res) => {
      // console.log(res.data)
      this.labData = res.data;
      console.log(this.labData);
    });
  },
  methods: {
    handleDelete(value) {
      var user = JSON.parse(sessionStorage.getItem("user"));
      var perms = user.perms;
      if (perms.indexOf("has:device:delete") > -1) {
        this.$confirm("是否确认删除该设备?", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            console.log(this.device);
            this.dialogFormVisible1 = false;
            deleteDevice(value).then((res) => {
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
      } else {
        this.$message({
          message: "没有删除权限",
          type: "warning",
        });
      }
    },
    handleEdit(value) {
      this.dialogFormVisible1 = true;
      this.device = value;
    },
    updateDevice(formName) {
      var user = JSON.parse(sessionStorage.getItem("user"));
      var perms = user.perms;
      if (perms.indexOf("has:device:edit") > -1) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("是否确认修改该设备?", "修改", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                console.log(this.device);
                this.dialogFormVisible1 = false;
                updateDevice(this.device).then((res) => {
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
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$message({
          message: "没有编辑权限",
          type: "warning",
        });
      }
    },
    insertDevice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认购买该设备?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            console.log(this.device);
            this.dialogFormVisible = false;
            this.device.createId = this.user.id;
            console.log(this.device);
            insertDevice(this.device).then((res) => {
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
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    handleAdd() {
      this.dialogFormVisible = true;
      this.device = {};
    },
    getList() {
      deviceQuery(this.queryParams, this.labId).then((res) => {
        console.log(res);
        this.deviceData = res.data;
        this.total = res.total;
        this.loading = false;
      });
    },
    resetQuery() {
      this.queryParams.param = "";
    },
    handleBroow(val) {
      this.dialogVisible2 = true;
      this.borrow.deviceId = val;
    },
    sure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认租借设备?", "租借", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.dialogVisible2 = false;
              this.loading = true;
              if (this.user.honesty == 0) {
                this.$message({
                  type: "info",
                  message: "诚信值不足",
                });
                this.loading = false;
                return;
              }
              borrowDevice(this.borrow).then((res) => {
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
                message: "已取消租借",
              });
            });
        }
      });
    },
    handleInsert(val) {
      this.$confirm("是否确定将该设备入库?", "入库", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          storeDevice(val).then((res) => {
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
            message: "已取消入库",
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

