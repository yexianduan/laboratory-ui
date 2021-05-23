<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认密码"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd, getPwd } from "@/api/student";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      id: "",
      test: "1test",
      password: "",
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.id = user.id;
    this.password = user.password;
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          getPwd(this.id,this.user.oldPassword).then((res) => {
            var flag = res.data;
            if (!flag) {
              this.$notify({
                title: "警告",
                message: "旧密码错误",
                type: "warning",
              });
              return;
            } else {
              this.$confirm("是否确定修改密码?", "提醒", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                updateUserPwd(this.id, this.user.newPassword).then(
                  (response) => {
                    this.$alert("密码修改成功请重新登录", "成功", {
                      confirmButtonText: "确定",
                      callback: (action) => {
                        this.$router.push("/login");
                      },
                    });
                  }
                );
              });
            }
          });
        }
      });
    },
  },
};
</script>