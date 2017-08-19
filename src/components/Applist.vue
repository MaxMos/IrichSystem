<style scoped>
</style>

<template>
<div class="page">
	<h1 class="pageTitle">应用列表</h1>
	<p class="totalTips">总共有 <strong>{{total}}</strong> 条应用数据</p>
	<Table stripe :columns="columns" :data="data"></Table>
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
			total: 0
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
		}
	},
	mounted() {
		this.loadData();
	}
};
</script>
