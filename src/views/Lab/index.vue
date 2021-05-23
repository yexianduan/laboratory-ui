<template>
  <div class="container">
    <div class="head">
      <el-form
        ref="form"
        :inline="true"
        :model="queryParams"
        label-width="80px"
      >
        <el-form-item label="实验室名称" label-width="80">
          <el-input
            v-model="queryParams.param"
            clearable
            placeholder="请输入实验室名称"
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
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >增加实验室</el-button
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
        :data="labData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column align="center" prop="name" label="实验室名称" width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="adress"
          label="地址"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="联系电话"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="remark" label="描述" width="260">
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
    <el-dialog title="增加实验室" :visible.sync="dialogFormVisible">
      <el-form
        :model="lab"
        :rules="labRules"
        ref="lab"
        label-width="100px"
      >
        <el-form-item label="实验室名称" prop="name">
          <el-input v-model="lab.name" placeholder="输入实验室名称"></el-input>
        </el-form-item>
         <el-form-item label="实验室名称" prop="name">
          <el-input v-model="lab.adress" placeholder="输入实验室地址"></el-input>
        </el-form-item>
        <el-form-item label="实验室电话" prop="phone">
          <el-input
            v-model.number="lab.phone"
            placeholder="输入实验室电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="实验室描述" prop="remark">
          <el-input
            type="textarea"
            v-model="lab.remark"
            placeholder="输入实验室描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertLab('lab')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- dialog  修改设备信息-->
    <el-dialog title="修改实验室信息" :visible.sync="dialogFormVisible1">
      <el-form
        :model="lab"
        :rules="labRules"
        ref="lab"
        label-width="100px"
      >
        <el-form-item label="实验室名称" prop="name">
          <el-input v-model="lab.name" placeholder="实验室名称"></el-input>
        </el-form-item>
           <el-form-item label="实验室地址" prop="adress">
          <el-input v-model="lab.adress" placeholder="实验室地址"></el-input>
        </el-form-item>
        <el-form-item label="实验室电话" prop="phone">
          <el-input
            v-model.number="lab.phone"
            placeholder="输入设备数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="实验室描述" prop="remark">
          <el-input
            type="textarea"
            v-model="lab.remark"
            placeholder="输入设备描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="updateLab('lab')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryLabByName,
  insertLab,
  deleteLab,
  updateLab,
} from "@/api/teacher";
export default {
  data() {
    return {
      dialogVisible2: false,
      queryParams: {
        pageCount: 1,
        pageSize: 10,
        param: "",
      },
      lab: {
        name: "",
        phone: "",
        adress: "",
        remark: "",
      },
      labRules: {
        name: [{ required: true, message: "请输入实验室名称", trigger: "blur" }],
        adress: [{ required: true, message: "请输入实验室地址", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            type: "number",
            message: "请输入整数",
          },
        ],
      },
      total: 0,
      labData: [],
      loading: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      user: {},
      id: "",
      labId:'',
    };
  },
  created() {
    this.loading = true;
    setTimeout(() => {
      this.getList();
    }, 1000);
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.user = user;
    this.labId=user.labId
  
  },
  methods: {
    handleDelete(value) {
        this.$confirm("是否确认删除该实验室?", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.dialogFormVisible1 = false;
            deleteLab(value).then((res) => {
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
    handleEdit(value) {
      this.dialogFormVisible1 = true;
      this.lab = value;
    },
    updateLab(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("是否确认修改该实验室?", "修改", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.dialogFormVisible1 = false;
                updateLab(this.lab).then((res) => {
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
    },
    insertLab(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("是否确认增加该实验室?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.dialogFormVisible = false;
            insertLab(this.lab).then((res) => {
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
      this.lab = {};
    },
    getList() {
      queryLabByName(this.queryParams).then((res) => {
        console.log(res);
        this.labData = res.data;
        this.total = res.total;
        this.loading = false;
      });
    },
    resetQuery() {
      this.queryParams.param = "";
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

