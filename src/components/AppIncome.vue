<style scoped>
.ctrlBox .item {
	display: inline-block;
	width: 400px;
}
</style>

<template>
<div class="page">
	<h1 class="pageTitle">下游APP收入数据<Tag style="float: right" color="blue">总收入 : <strong>$ {{totalRevenue}}</strong></Tag></h1>
	<p class="totalTips">总共有 <strong>{{total}}</strong> 条下游APP收入数据</p>
	<Table stripe :columns="columns" :data="data"></Table>
</div>
</template>

<script>
export default {
	data() {
		return {
			columns: [{
					title: '下游 ID',
					key: 'chn_id',
					sortable: true
				},
				{
					title: 'App ID',
					key: 'app_id'
				},
				{
					title: 'App 名称',
					key: 'app_name'
				},
				{
					title: '点击',
					key: 'recv_click'
				},
				{
					title: '有效点击',
					key: 'valid_click'
				},
				{
					title: '安装',
					key: 'recv_install'
				},
				{
					title: '安装(扣量后)',
					key: 'post_install'
				},

				{
					title: '转化率(安装/点击)',
					key: 'rate',
					render: (h, params) => {
						return h('div', [
							h('span', (params.row.post_install / params.row.valid_click).toFixed(2))
						]);
					},
				},
				{
					title: '收入($)',
					key: 'income',
					sortable: true
				}
			],
			data: [],
			total: 0,
			totalRevenue: 0
		}
	},
	methods: {
		loadData() {
			this.$Loading.start();
			let self = this;
			this.$http.post("/Interface/getChnAppIncome", {}).then(function(res) {
				var data = res.data;
				switch (data.retcode) {
					case 0:
						if (data.retdata.length > 0) {
							let dataFomat = [],totalRevenue = 0;
							data.retdata.forEach((n) => {
								if (n.detail) {
									n.detail.forEach((i) => {
										i.chn_id = n.chn_id;
										dataFomat.push(i);
									});
								}
							});
							dataFomat.forEach((item)=>{
								totalRevenue += item.income;
							});
							self.totalRevenue = totalRevenue;
							self.data = dataFomat;
							self.total = dataFomat.length;
						}
						this.$Loading.finish();
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
