<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user1.userName }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-phone" />手机号码
                <div class="pull-right">{{ user1.phone }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-notebook-1" />学院
                <div class="pull-right">{{ user1.college }}</div>
              </li>
              <li class="list-group-item">
                <i class="el-icon-notebook-2" />专业
                <div class="pull-right">{{ user1.major }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <el-form
                ref="form"
                :model="user"
                :rules="rules"
                label-width="80px"
              >
                <el-form-item label="用户名称" prop="userName">
                  <el-input v-model="user.userName" />
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="user.phone" maxlength="11" />
                </el-form-item>
                <el-form-item label="学院" prop="college">
                  <el-input v-model="user.college" maxlength="50" />
                </el-form-item>
                <el-form-item label="专业" prop="major">
                  <el-input v-model="user.major" maxlength="50" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="submit"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { updateUser } from "@/api/student";

export default {
  name: "Profile",
  components: { userInfo, resetPwd },
  data() {
    return {
      user: {},
      user1:{},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
      rules: {
        userName: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.user = user;
    this.user1=user;
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$confirm("是否确定修改信息?", "提醒", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            updateUser(this.user).then((response) => {
              this.$notify({
                title: "成功",
                message: '修改成功',
                type: "success",
              });
              sessionStorage.setItem("user", JSON.stringify(this.user));
              this.created();
            });
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/rouyi.scss";
</style>