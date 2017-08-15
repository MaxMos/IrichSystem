<style scoped>
h1,
h2 {
    font-weight: normal;
    color: #fff;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

.login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    background-color: #141a48;
    background-image: url("../assets/bg.jpg?v=1.0.0");
}

.wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 640px;
    height: 392px;
    margin: -220px 0 0 -320px;
}

.copyright {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    color: #fff;
    text-align: center;
}

.version {
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid #fff;
}

.logo {
    margin: 20px 0;
}

.login-inputBox {
    margin: 20px 20%;
    padding: 20px 20px 0;
    border-radius: 6px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .1);
    background-color: #fff;
    overflow: hidden;
}

.login-inputBox input {
    margin: 10px 0;
}
</style>

<template>
<div class="login">
    <div class="wrapper">
        <img class="logo" src="../assets/logo.png?v=1.0.0"></img>
        <h1></h1>
        <h2></h2>
        <div class="login-inputBox">
            <Form ref="form" :model="form" :rules="rule" :label-width="0">
                <Form-item prop="user">
                    <Input type="text" size="large" v-model="form.user" placeholder="账号">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item prop="password">
                    <Input type="password" size="large" v-model="form.password" placeholder="密码">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="handleSubmit" long>登录</Button>
                </Form-item>
            </Form>
        </div>
    </div>
    <p class="copyright">
        <span class="version">System Version：v1.0.0</span>
        <span>Copyright © Irich Mobi 2017</span>
    </p>
</div>
</template>

<script>
import router from "../router";
export default {
    name: "login",
    data() {
        return {
            loading: false,
            name: "",
            pwd: "",
            form: {
                user: "",
                password: ""
            },
            rule: {
                user: [{
                    required: true,
                    message: "请填写用户名",
                    trigger: "blur"
                }],
                password: [{
                    required: true,
                    message: "请填写密码",
                    trigger: "blur"
                }]
            }
        };
    },
    methods: {
        handleSubmit() {
            var self = this;
            this.$refs['form'].validate(function(valid) {
                if (valid) {
                    self.$http.post("/Interface/login", {
                        username: self.form.user,
                        password: self.form.password
                    }).then(function(res) {
                        var data = res.data;
                        switch (data.retcode) {
                            case 0:
                                router.replace({
                                    name: 'dashboard'
                                });
                                break;
                            case -1:
                                self.$Message.error("此账号不存在，请重新尝试！");
                                break;
                            case -7:
                                self.$Message.error("密码错误，请重新尝试！");
                                break;
                            default:
                                self.$Message.error(data.retmsg);

                        }
                    });
                } else {
                    self.$Message.error("表单验证失败！");
                }
            });
        }
    }
};
</script>
