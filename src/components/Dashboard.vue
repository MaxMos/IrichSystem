<style>
.layout {
	background: #f5f7f9;
	position: absolute;
	width: 100%;
	height: 100%;
}

.layout-breadcrumb {
	padding: 10px 15px 0;
}

.layout-copy {
	position: absolute;
	bottom: 10px;
	left: 10px;
	right: 10px;
	text-align: center;
	padding: 10px 0 20px;
	color: #9ea7b4;
}

.layout-menu-left {
	background: #464c5b;
}

.layout-main {
	overflow: auto;
}

.layout-hide-text .layout-menu-left {
	text-align: center;
}

.layout-header {
	position: fixed;
	width: 100%;
	z-index: 10;
	height: 60px;
	background: #fff;
	box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.welcome {
	position: fixed;
	right: 20px;
	top: 18px;
}

.layout-logo-left {
	width: 90%;
	height: 30px;
	border-radius: 3px;
	margin: 15px auto;
	text-align: center;
}

.layout-content {
	min-height: 200px;
	margin: 75px 15px 15px;
	background: #fff;
	border-radius: 4px;
}

.layout-content-main {
	padding: 20px;
}

.layout-ceiling-main a {
	color: #9ba7b5;
}

.layout-hide-text .layout-text {
	display: none;
}

.ivu-col {
	position: relative;
	transition: width .2s ease-in-out;
}

.ivu-row-flex {
	height: 100%;
}

.itemClassTitle {
	margin: 20px 0;
	position: relative;
	font-weight: 500;
	color: #39f;
}

.itemClassTitle:before {
	content: "";
	display: block;
	width: 100%;
	height: 1px;
	background: #eee;
	position: absolute;
	top: 10px;
	left: 0;
}

.itemClassTitle span {
	display: inline-block;
	background: #fff;
	padding: 0 20px;
	position: relative;
	margin-left: 100px;
	font-size: 14px;
}

.ivu-menu {
	overflow: hidden;
}
</style>
<template>
<div class="layout" :class="{'layout-hide-text': spanLeft < 4}">
	<Row type="flex">
		<i-col :span="spanLeft" class="layout-menu-left">
			<Menu :active-name="routerName" theme="dark" width="auto" @on-select="select">
				<div class="layout-logo-left">
					<img src="../assets/logo.png?v=1.0.0" height="100%">
				</div>
				<Submenu name="profile">
					<template slot="title">
                        <Icon type="ios-settings-strong" :size="iconSize"></Icon>
                        媒介管理
                    </template>
                    <Menu-item name="chnlist">下游列表</Menu-item>
					<Menu-item name="applist">应用列表</Menu-item>
				</Submenu>
                <Submenu name="product">
					<template slot="title">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        广告管理
                    </template>
					<Menu-item name="2-1">联盟列表</Menu-item>
                    <Menu-item name="adlist">广告数据</Menu-item>
				</Submenu>
			</Menu>
			<div class="layout-copy">&copy; Irich Mobi 2017</div>
		</i-col>
		<i-col :span="spanRight" class="layout-main">
			<div class="layout-header">
				<div class="welcome">
					<span v-if="userName">{{userName}}，</span>
					<span>欢迎使用 Irich Mobi System！</span>
					<span style="padding-left: 10px;">
                      <Button type="ghost" icon="log-out" size="small" @click="logout">退出登录</Button>
                    </span>
				</div>
			</div>
			<div class="layout-content">
				<div class="layout-content-main">
					<router-view></router-view>
				</div>
			</div>
		</i-col>
	</Row>
	<Modal v-model="modal_changePSW" title="修改密码" @on-cancel="cancel">
		<div style="margin-top: 15px;">
			<Form ref="passWord" :model="passWord" :rules="rule" :label-width="0">
				<Form-item prop="pswOne">
					<Input type="password" size="large" v-model="passWord.pswOne" placeholder="新密码">
					<Icon type="ios-locked-outline" slot="prepend"></Icon>
					</Input>
				</Form-item>
				<Form-item prop="pswTwo">
					<Input type="password" size="large" v-model="passWord.pswTwo" placeholder="确认密码">
					<Icon type="ios-locked-outline" slot="prepend"></Icon>
					</Input>
				</Form-item>
			</Form>
		</div>
		<div slot="footer">
			<Button type="primary" @click="confirmPassWord('passWord')" size="large" long>提交</Button>
		</div>
	</Modal>
</div>
</template>
<script>
import router from "../router";
export default {
	data() {
		return {
			modal_changePSW: false,
			userName: '',
			passWord: {
				pswOne: '',
				pswTwo: ''
			},
			rule: {
				pswOne: [{
					required: true,
					message: "请填写密码",
					trigger: "blur"
				}, {
					type: 'string',
					min: 6,
					message: '密码不能少于六位数',
					trigger: 'blur'
				}],
				pswTwo: [{
					required: true,
					message: "请确认密码",
					trigger: "blur"
				}, {
					type: 'string',
					min: 6,
					message: '密码不能少于六位数',
					trigger: 'blur'
				}]
			},
			spanLeft: 4,
			spanRight: 20,
			routerName: router.app.$route.name || 'dashboard'
		}
	},
	computed: {
		iconSize() {
			return this.spanLeft === 4 ? 14 : 24;
		}
	},
	mounted: function() {
		// let _this = this;
		// _this.$http.post("/Interface/getUserInfo", {}).then(function(res) {
		// 	let data = res.data;
		// 	switch (data.retcode) {
		// 		case 0:
		// 			_this.userName = data.retdata.userName;
		// 			break;
		// 		default:
		// 			_this.$Message.error(data.retmsg);
		// 			break;
		// 	}
		// });
	},
	methods: {
		toggleClick() {
			if (this.spanLeft === 4) {
				this.spanLeft = 2;
				this.spanRight = 22;
			} else {
				this.spanLeft = 4;
				this.spanRight = 20;
			}
		},
		select(name) {
			router.push({
				name: name
			});
		},
		changePsw() {
			this.modal_changePSW = !this.modal_changePSW;
			this.passWord.pswOne = '';
			this.passWord.pswTwo = '';
		},
		confirmPassWord(name) {
			let _this = this;
			this.$refs[name].validate((valid) => {
				if (valid) {
					if (_this.passWord.pswOne === _this.passWord.pswTwo) {
						this.$http.post("/Interface/changePwd", {
							userName: _this.userName,
							userPwd: _this.passWord.pswOne
						}).then(function(res) {
							let data = res.data;
							switch (data.retcode) {
								case 0:
									_this.userName = _this.passWord.user;
									_this.modal_changePSW = !_this.modal_changePSW;
									_this.$Message.success('修改成功!');
									break;
								default:
									_this.$Message.error(data.retmsg);
									break;
							}
						});
					} else {
						_this.$Message.error("密码不一样！");
					}
				} else {
					this.$Message.error('您填写的信息有错误哦，请仔细检查！');
				}
			})
		},
		cancel() {
			this.passWord.pswOne = '';
			this.passWord.pswTwo = '';
		},
		logout() {
			this.$http.post("/Interface/logout").then(function(res) {
				router.replace({
					name: 'login'
				});
			});
		}
	}
}
</script>
