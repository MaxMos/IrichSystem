<style scoped>
</style>

<template>
<div class="page">
	<h1 class="pageTitle">联盟列表</h1>
	<div class="ctrlBox">
		<Button type="primary" icon="plus" size="large" @click="modalShow">创建联盟</Button>
	</div>
	<p class="totalTips">总共有 <strong>{{total}}</strong> 条联盟数据</p>
	<Table stripe :columns="columns" :data="data"></Table>

	<Modal v-model="modal" :loading="modalLoading" title="创建联盟" width="40" ok-text="创建" @on-ok="save" @on-cancel="cancel">
		<Form ref="createAder" :model="formItem" :rules="ruleValidate" :label-width="100">
			<Form-item label="Api Name" prop="api_name">
				<Input v-model="formItem.api_name"></Input>
			</Form-item>
			<Form-item label="联盟名字" prop="name">
				<Input v-model="formItem.name"></Input>
			</Form-item>
			<Form-item label="Callback URL" prop="resp_callback_url">
				<Input v-model="formItem.resp_callback_url"></Input>
			</Form-item>
			<Form-item label="Callback Token" prop="resp_callback_token">
				<Input v-model="formItem.resp_callback_token"></Input>
			</Form-item>
			<FormItem label="拉取广告">
				<i-switch v-model="formItem.is_pulled" size="large">
					<span slot="open">开启</span>
					<span slot="close">关闭</span>
				</i-switch>
			</FormItem>
		</Form>
	</Modal>
</div>
</template>

<script>
export default {
	data() {
		return {
			columns: [{
					title: '联盟ID',
					key: 'id'
				},
				{
					title: '联盟名字',
					key: 'name'
				},
				{
					title: 'Api Name',
					key: 'api_name'
				},
				{
					title: '下游状态',
					key: 'is_pulled',
					render: (h, params) => {
						let text = '',
							type = '';
						switch (params.row.is_pulled) {
							case 1:
								text = '拉取中';
								type = 'green';
								break;
							case 0:
								text = '暂停';
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
						switch (params.row.is_pulled) {
							case 1:
								text = '暂停拉取';
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
				api_name: '',
				name: '',
				resp_callback_url: '',
				resp_callback_token: '',
				is_pulled: true
			},
			ruleValidate: {
				api_name: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}],
				name: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}],
				resp_callback_url: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}],
				resp_callback_token: [{
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
			this.$http.post("/Interface/getAder", {}).then(function(res) {
				var data = res.data;
				switch (data.retcode) {
					case 0:
						if (data.retdata.union.length > 0) {
							self.data = data.retdata.union;
							self.total = data.retdata.union.length;
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
			this.$http.post("/Interface/setStatus", {
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
			this.$refs['createAder'].resetFields();
		},
		save() {
			let self = this;
			this.$refs['createAder'].validate((valid) => {
				if (valid) {
					this.$http.post("/Interface/createAder", {
						api_name: self.formItem.api_name,
						name: self.formItem.name,
						resp_callback_url: self.formItem.resp_callback_url,
						resp_callback_token: self.formItem.resp_callback_token,
						is_pulled: self.formItem.is_pulled ? '1' : '0'
					}).then(function(res) {
						var data = res.data;
						switch (data.retcode) {
							case 0:
								self.$Message.success(data.retmsg);
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
