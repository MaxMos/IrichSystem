<style scoped>
</style>

<template>
<div class="page">
	<h1 class="pageTitle">联盟收入数据<Tag style="float: right" color="blue">总收入 : <strong>$ {{totalRevenue}}</strong></Tag></h1>
	<p class="totalTips">总共有 <strong>{{total}}</strong> 条联盟收入数据</p>
	<Table stripe :columns="columns" :data="data"></Table>
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
					title: '收入',
					key: 'income',
					render: (h, params) => {
						let text,className = '';
						if(params.row.income) {
							text = params.row.income;
						} else {
							text = '暂无收入';
							className = 'grey';
						}
						return h('div', [
							h('span', {class: className}, params.row.income ? params.row.income : '暂无收入')
						]);
					},
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
			this.$http.post("/Interface/getAderIncome", {}).then(function(res) {
				var data = res.data;
				switch (data.retcode) {
					case 0:
						self.data = data.retdata;
						self.total = data.retdata.length;
						let totalRevenue = 0;
						data.retdata.forEach((item)=>{
							totalRevenue += Number(item.income ? item.income : 0);
						});
						self.totalRevenue = totalRevenue;
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
