<style>
.token .ivu-input[disabled] {
	color: #333;
	background-color: #d8dfe1;
}
</style>

<template>
<div class="page">
	<h1 class="pageTitle">应用列表</h1>
	<p class="totalTips">总共有 <strong>{{total}}</strong> 条应用数据</p>
	<Table stripe :columns="columns" :data="data"></Table>

	<Modal v-model="createOfferModal" :loading="createOfferModalLoading" title="创建Offer" width="40" ok-text="创建" @on-ok="saveCreateOffer" @on-cancel="cancel('createOffer')">
		<Form ref="createOffer" :model="createOfferItem" :label-width="100">
			<Form-item label="App ID" class="token">
				<Input v-model="createOfferItem.app_id" disabled></Input>
			</Form-item>
			<Form-item label="App名称" class="token">
				<Input v-model="createOfferItem.app_name" disabled></Input>
			</Form-item>
			<FormItem label="联盟">
				<Select v-model="createOfferItem.ader_id" placeholder="请选择联盟">
	                <Option v-for="item in aderList" :key="item.id" :value="item.id">{{item.name}}（ {{item.api_name}} ）</Option>
	            </Select>
			</FormItem>
		</Form>
	</Modal>

	<Modal v-model="setDPModal" :loading="setDPModalLoading" title="设置分成与扣量" width="40" ok-text="保存" @on-ok="saveSetDP" @on-cancel="cancel('setDP')">
		<Form ref="setDP" :model="setDPItem" :rules="ruleValidate" :label-width="60">
			<Form-item label="App ID" class="token">
				<Input v-model="setDPItem.app_id" disabled></Input>
			</Form-item>
			<Form-item label="App名称" class="token">
				<Input v-model="setDPItem.app_name" disabled></Input>
			</Form-item>
			<Form-item label="分成" prop="divide">
				<Input v-model="setDPItem.divide" :placeholder="setDPItem.dividePh">
				<span slot="append">%</span>
				</Input>
			</Form-item>
			<Form-item label="扣量" prop="deduction">
				<Input v-model="setDPItem.deduction" :placeholder="setDPItem.deductionPh">
				<span slot="append">%</span>
				</Input>
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
					title: '平台',
					key: 'platform',
					render: (h, params) => {
						let iconType = '';
						switch (params.row.platform.toLocaleLowerCase()) {
							case 'android':
								iconType = 'social-android';
								break;
							case 'ios':
								iconType = 'social-apple';
								break;
						}
						return h('div', [
							h('Icon', {
								props: {
									type: iconType,
									size: 16
								}
							}),
							h('strong', ' ' + params.row.platform)
						]);
					},
					sortable: true
				},
				{
					title: 'App ID',
					key: 'app_id'
				},
				{
					title: 'App名称',
					key: 'app_name'
				},
				{
					title: 'App Secret',
					key: 'app_secret'
				},
				{
					title: '包名',
					key: 'pkg_name'
				},
				{
					title: '状态',
					key: 'status',
					render: (h, params) => {
						let text = '',
							type = '';
						switch (params.row.status) {
							case 1:
								text = 'Approved';
								type = 'green';
								break;
							case 0:
								text = 'Unfinished';
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
					title: '下游ID',
					key: 'chn_id',
					sortable: true
				},
				{
					title: '分成',
					key: 'divide',
					sortable: true,
					render: (h, params) => {
						let result = params.row.divide ? params.row.divide * 100 + '%' : '未设置';
						return h('div', [
							h('Button', {
								on: {
									click: () => {
										this.setDPModalShow(params);
									}
								}
							}, result)
						]);
					}
				},
				{
					title: '扣量',
					key: 'deduction',
					sortable: true,
					render: (h, params) => {
						let result = params.row.deduction ? params.row.deduction * 100 + '%' : '未设置';
						return h('div', [
							h('Button', {
								on: {
									click: () => {
										this.setDPModalShow(params);
									}
								}
							}, result)
						]);
					}
				},
				{
					title: '操作',
					key: 'action',
					fixed: 'right',
					width: 220,
					render: (h, params) => {
						let text = '',
							type = '';
						switch (params.row.status) {
							case 1:
								text = '冻结';
								type = 'warning';
								break;
							case 0:
								text = '激活';
								type = 'primary';
								break;
						}
						return h('div', [
							h('Button', {
								props: {
									type: type,
									icon: 'ios-gear',
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.ChunStatusToggle(params);
									}
								}
							}, text), h('Button', {
								on: {
									click: () => {
										this.createOfferModalShow(params);
									}
								}
							}, '创建Offer')
						]);
					}
				}
			],
			data: [],
			aderList: [],
			total: 0,
			createOfferModal: false,
			createOfferModalLoading: true,
			app_id: null,
			createOfferItem: {
				app_id: '',
				app_name: '',
				ader_id: ''
			},
			setDPModal: false,
			setDPModalLoading: true,
			app_id: null,
			setDPItem: {
				app_id: '',
				app_name: '',
				deduction: '',
				divide: '',
				deductionPh: '',
				dividePh: ''
			},
			ruleValidate: {
				deduction: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}],
				divide: [{
					required: true,
					message: '必填项',
					trigger: 'blur'
				}]
			}
		}
	},
	computed: {},
	methods: {
		loadData() {
			this.$Loading.start();
			let self = this;
			this.$http.post("/Interface/listApp", {}).then(function(res) {
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
			this.$http.post("/Interface/setAppStatus", {
				chn_id: params.row.chn_id,
				app_id: params.row.app_id,
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
		createOfferModalShow(params) {
			this.createOfferModal = true;
			this.createOfferItem.app_name = params.row.app_name;
			this.createOfferItem.app_id = params.row.app_id;
		},
		setDPModalShow(params) {
			this.setDPModal = true;
			this.setDPItem.app_name = params.row.app_name;
			this.setDPItem.app_id = params.row.app_id;
			this.setDPItem.deductionPh = params.row.deduction ? Number(params.row.deduction * 100) : '请输入分成比例（单位百分比）';
			this.setDPItem.dividePh = params.row.divide ? Number(params.row.divide * 100) : '请输入扣量比例（单位百分比）';
		},
		cancel(target) {
			this.$refs[target].resetFields();
		},
		saveCreateOffer() {
			let self = this;
			this.$http.post("/Interface/createOfferByUnion", {
				ader_id: self.createOfferItem.ader_id,
				app_id: self.createOfferItem.app_id
			}).then(function(res) {
				var data = res.data;
				switch (data.retcode) {
					case 0:
						self.$Message.success(data.retmsg);
						this.createOfferModal = false;
						this.createOfferModalLoading = false;
						break;
					default:
						self.$Message.error(data.retmsg);
						this.createOfferModalLoading = true;
				}
			});
		},
		saveSetDP() {
			let self = this;
			this.$refs['setDP'].validate((valid) => {
				if (valid) {
					this.$http.post("/Interface/SetDP", {
						app_id: self.setDPItem.app_id,
						deduction: self.setDPItem.deduction / 100,
						divide: self.setDPItem.divide / 100
					}).then(function(res) {
						var data = res.data;
						switch (data.retcode) {
							case 0:
								self.$Message.success(data.retmsg);
								self.setDPModal = false;
								self.loadData();
								break;
							default:
								self.$Message.error(data.retmsg);
								self.setDPModal = false;
						}
					});
				} else {
					this.setDPModalLoading = false;
				}
			})
		}
	},
	mounted() {
		this.loadData();
		let self = this;
		this.$http.post("/Interface/getAder", {}).then(function(res) {
			var data = res.data;
			switch (data.retcode) {
				case 0:
					if (data.retdata.union.length > 0) {
						self.aderList = data.retdata.union;
						self.createOfferItem.ader_id = self.aderList[0].id;
					}
					break;
				default:
					self.$Message.error(data.retmsg);
			}
		});
	}
};
</script>
