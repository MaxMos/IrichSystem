<style scoped>
</style>

<template>
<div class="page">
	<h1 class="pageTitle">下游列表</h1>
	<div class="ctrlBox">
		<Button type="primary" icon="plus" size="large" @click="modalShow">创建下游账号</Button>
	</div>
	<p class="totalTips">总共有 <strong>{{total}}</strong> 条下游数据</p>
	<Table stripe :columns="columns" :data="data"></Table>

	<Modal v-model="modal" :loading="modalLoading" title="创建下游账号" width="40" ok-text="创建" @on-ok="save" @on-cancel="cancel">
		<Form ref="createChn" :model="formItem" :rules="ruleValidate" :label-width="80">
			<Form-item label="下游名字" prop="username">
				<Input v-model="formItem.username"></Input>
			</Form-item>
			<Form-item label="登录密码" prop="passwd">
				<Input v-model="formItem.passwd"></Input>
			</Form-item>
			<Form-item label="Email" prop="email">
				<Input v-model="formItem.email"></Input>
			</Form-item>
		</Form>
	</Modal>
</div>
</template>

<script>
export default {
	data() {
		return {
			columns: [{
					title: '下游ID',
					key: 'chn_id'
				},
				{
					title: '下游名字',
					key: 'name'
				},
				{
					title: 'Email',
					key: 'email'
				},
				{
					title: '下游状态',
					key: 'status',
					render: (h, params) => {
						let text = '',
							type = '';
						switch (params.row.status) {
							case 1:
								text = '正常';
								type = 'green';
								break;
							case 0:
								text = '冻结';
								type = 'yellow';
								break;
						}
						return h('div', [
							h('Tag', {
								props: {
									color: type
								}
							}, text)
						]);
					},
					sortable: true
				},
				{
					title: '操作',
					key: 'action',
					render: (h, params) => {
						let text = '',
							type = '';
						switch (params.row.status) {
							case 1:
								text = '冻结';
								type = 'warning';
								break;
							case 0:
								text = '开放';
								type = 'primary';
								break;
						}
						return h('div', [
							h('Button', {
								props: {
									type: type,
									icon: 'ios-gear',
								},
								on: {
									click: () => {
										this.ChunStatusToggle(params);
									}
								}
							}, text)
						]);
					}
				}
			],
			data: [],
			total: 0,
			modal: false,
			modalLoading: true,
			app_id: null,
			formItem: {
				username: '',
				passwd: '',
				email: ''
			},
			ruleValidate: {
				username: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}],
				passwd: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}],
				email: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}]
			}
		}
	},
	methods: {
		loadData() {
			this.$Loading.start();
			let self = this;
			this.$http.post("/Interface/listChn", {}).then(function(res) {
				var data = res.data;
				switch (data.retcode) {
					case 0:
						if (data.retdata.length > 0) {
							self.data = data.retdata;
							self.total = data.retdata.length;
						}
						this.$Loading.finish();
						break;
					default:
						self.$Message.error(data.retmsg);
						this.$Loading.error();
				}
			});
		},
		ChunStatusToggle(params) {
			let self = this,
				status = params.row.status == 1 ? 0 : 1;
			this.$http.post("/Interface/setChnStatus", {
				chn_id: params.row.chn_id,
				status: status
			}).then(function(res) {
				var data = res.data;
				switch (data.retcode) {
					case 0:
						self.$Message.success(data.retmsg);
						self.data[params.index].status = status;
						break;
					default:
						self.$Message.error(data.retmsg);
						this.$Loading.error();
				}
			});
		},
		modalShow() {
			this.modal = true;
		},
		cancel() {
			this.$refs['createChn'].resetFields();
		},
		save() {
			let self = this;
			this.$refs['createChn'].validate((valid) => {
				if (valid) {
					this.$http.post("/Interface/createChn", {
						username: self.formItem.username,
						passwd: self.formItem.passwd,
						email: self.formItem.email
					}).then(function(res) {
						var data = res.data;
						switch (data.retcode) {
							case 0:
								self.$Message.success(data.retmsg);
								// this.modal = false;
								this.modal = false;
								this.loadData();
								break;
							default:
								self.$Message.error(data.retmsg);
								this.modalLoading = false;
						}
					});
				} else {
					this.modalLoading = false;
				}
			})
		}
	},
	mounted() {
		this.loadData();
	}
};
</script>
