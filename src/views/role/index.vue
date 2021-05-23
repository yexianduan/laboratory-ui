<template>
  <div class="container">
    <div class="head">
      <el-form
        ref="form"
        :inline="true"
        :model="queryParams"
        label-width="80px"
      >
        <el-form-item label="角色名称">
          <el-input
            v-model="queryParams.param.roleName"
            clearable
            placeholder="请输入角色名称"
            size="small"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="实验室">
          <el-input
            v-model="queryParams.param.labName"
            clearable
            placeholder="请输入实验室"
            size="small"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.param.status"
            placeholder="角色状态"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="queryParams.param.userName"
            clearable
            placeholder="请输入姓名"
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
        <el-form-item label="验证码">
          <el-input
            v-model="code"
            clearable
            placeholder="请输如验证码"
            size="small"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="test"
            >验证</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetCodeQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="opt">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >新增</el-button
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
        :data="roleData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="角色名称"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="userName"
          label="姓名"
          width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="labName"
          label="实验室"
          width="150"
        >
        </el-table-column>
        <el-table-column align="center" label="状态" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="2"
              inactive-value="1"
              @change="handleStatusChange(scope.row.id, scope.row.status)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row.id)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
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

    <el-dialog title="新增人员" :visible.sync="dialogFormVisible">
      <el-form :model="user" :rules="roleRule" ref="user" label-width="100px">
        <el-form-item label="学号" prop="sId">
          <el-input v-model="user.sId" placeholder="输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model.number="user.userName"
            placeholder="输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="nickName">
          <el-input v-model="user.nickName" placeholder="输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" placeholder="输入密码"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="输入电话"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="remark">
          <el-select
            v-model="user.remark"
            placeholder="角色状态"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in remarkOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实验室" prop="labName">
          <el-select
            v-model="user.labId"
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
        <el-form-item label="学院" prop="college">
          <el-input v-model="user.college" placeholder="输入学院"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="user.major" placeholder="输入专业"></el-input>
        </el-form-item>

        <el-form-item label="权限">
          <el-select
            multiple
            v-model="perms.perm"
            placeholder="选择权限"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in permsOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="user.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
              :value="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertRole('user')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择权限" :visible.sync="dialogFormVisible1">
      <el-form :model="perms" :rules="permRule" ref="perms" label-width="100px">
        <el-form-item label="权限" prop="perm">
          <el-select
            multiple
            v-model="perms.perm"
            placeholder="选择权限"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in permsOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="updateMenu('perms')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryUserRole,
  stopRole,
  insertRole,
  deleteRole,
  editMenu,
  insertUserRole,
  verifyCode,
  getLab,
} from "@/api/teacher";
export default {
  data() {
    return {
      queryParams: {
        pageCount: 1,
        pageSize: 10,
        param: {
          roleName: "",
          remark: "",
          labName: "",
          status: "",
        },
      },
      code: "",
      statusOptions: [
        {
          value: "2",
          label: "正常",
        },
        {
          value: "1",
          label: "停用",
        },
      ],
      remarkOptions: [
        {
          value: "超级管理员",
          label: "超级管理员",
        },
        {
          value: "学生",
          label: "学生",
        },
        {
          value: "老师",
          label: "老师",
        },
      ],
      permsOptions: [
        {
          value: "has:device:edit",
          label: "编辑设备",
        },
        {
          value: "has:device:delete",
          label: "删除设备",
        },
      ],
      user: {
        sId: "",
        userName: "",
        nickName: "",
        password: "",
        phone: "",
        remark: "",
        college: "",
        majoe: "",
        // perms: [],
        role: "",
        status: "",
        labId: "",
      },
      perms: {
        id: "",
        perm: [],
      },
      permRule: {
        perm: [{ required: true, message: "请选择权限", trigger: "blur" }],
      },
      roleRule: {
        userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        nickName: [
          { required: true, message: "请输入登录名", trigger: "blur" },
        ],
        labId:[{required: true, message: "请选择实验室", trigger: "blur"}],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],

        remark: [
          { required: true, message: "请选择角色名称", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择角色状态", trigger: "blur" },
        ],
      },
      id: "",
      total: 0,
      roleData: [],
      loading: false,
      dialogFormVisible1: false,
      dialogFormVisible: false,
      labData: [],
    };
  },
  created() {
    this.loading = true;
    setTimeout(() => {
      this.getList();
    }, 1000);
    getLab().then((res) => {
      // console.log(res.data)
      this.labData = res.data;
      console.log(this.labData);
    });
  },
  methods: {
    resetCodeQuery() {
      this.code = "";
    },
    test() {
      if (this.code == "") {
        this.$message({
          message: "提示",
          type: "请输入验证码",
        });
      } else {
        this.$confirm("是否确认验证该验证码?", "确定", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          verifyCode(this.code).then((res) => {
            if (res.data == true) {
              this.$notify({
                title: "成功",
                message: "验证成功",
                type: "success",
              });
            } else {
              this.$notify({
                title: "失败",
                message: "验证失败",
                type: "danger",
              });
            }
          });
          this.code = "";
        });
      }
    },
    insertRole(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认增加该人员?", "增加", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              console.log(this.user);
              this.dialogFormVisible = false;
              insertRole(this.user).then((res) => {
                this.loading = true;
                var id = res.data;
                editMenu(id, this.perms).then((res) => {
                  console.log(res);
                });
                var roleId;
                if (this.user.remark == "超级管理员") roleId = 1;
                if (this.user.remark == "老师") roleId = 3;
                if (this.user.remark == "学生") roleId = 2;
                insertUserRole(id, roleId).then((res) => {
                  console.log(res);
                });
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
    },

    resetQuery() {
      this.queryParams.param = {};
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
    getList() {
      queryUserRole(this.queryParams).then((res) => {
        this.roleData = res.data;
        console.log(this.roleData);
        this.total = res.total;
        this.loading = false;
      });
    },
    handleStatusChange(val, status) {
      let text = status === "2" ? "启用" : "停用";
      this.$confirm("确认要" + text + "该角色吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          stopRole(val, status).then((res) => {
            if (res.data == true) {
              this.loading = true;
              setTimeout(() => {
                this.$notify({
                  title: "成功",
                  message: res.message,
                  type: "success",
                });
                this.getList();
              }, 1000);
            } else {
              this.loading = true;
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
          this.getList();
        });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.user = {};
    },
    handleUpdate(val) {
      this.dialogFormVisible1 = true;
      this.perms.perm = [];
      this.id = val;
    },
    updateMenu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editMenu(this.id, this.perms).then((res) => {
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
        } else {
          return false;
        }
      });
    },
    handleDelete(val) {
      this.$confirm("确认要删除该角色吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole(val).then((res) => {
            if (res.data == true) {
              this.loading = true;
              setTimeout(() => {
                this.$notify({
                  title: "成功",
                  message: res.message,
                  type: "success",
                });
                this.getList();
              }, 1000);
            } else {
              this.loading = true;
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
          this.getList();
        });
    },
  },
};
</script>

<style  scoped>
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