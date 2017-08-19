<style scoped>
.ctrlBox .item {
	display: inline-block;
	width: 400px;
}

.pageCount {
	margin-top: 20px;
	text-align: right;
}
</style>

<template>
<div class="page">
	<h1 class="pageTitle">广告数据</h1>
	<div class="ctrlBox">
		<div class="item">
			<Input v-model="ader_id" placeholder="请输入联盟的ID">
			<span slot="prepend">联盟ID</span>
			<Button slot="append" icon="ios-search" @click="search"></Button>
			</Input>
		</div>
	</div>
	<p class="totalTips">总共有 <strong>{{total}}</strong> 条广告数据</p>
	<Table stripe border :columns="columns" :data="data"></Table>
	<div class="pageCount">
		<Page :total="total" :current="page" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,40,100]" show-sizer></Page>
	</div>
</div>
</template>

<script>
export default {
	data() {
		return {
			ader_id: null,
			page: 1,
			page_size: 10,
			total: 0,
			columns: [{
				title: '广告名',
				key: 'ad_name'
			}, {
				title: 'ID/包名',
				key: 'pkg_name'
			}, {
				title: '联盟名称',
				key: 'name',
				sortable: true
			}, {
				title: '投放地区',
				key: 'region',
				sortable: true
			}, {
				title: '广告主出价',
				key: 'get_price',
				sortable: true
			}, {
				title: '下放价',
				key: 'put_price',
				sortable: true
			}, {
				title: '成本价',
				key: 'access_price',
				sortable: true
			}, {
				title: '有效点击数',
				key: 'click',
				sortable: true
			}, {
				title: '安装数',
				key: 'installed',
				sortable: true
			}, {
				title: '我方收入',
				key: 'income',
				sortable: true
			}],
			data: []
		}
	},
	methods: {
		loadData() {
			this.$Loading.start();
			let self = this,
				param = {
					page: self.page,
					page_size: self.page_size
				};
			if (this.ader_id !== null) {
				param.ader_id = this.ader_id;
			}
			this.$http.post("/Interface/getAdAll", param).then(function(res) {
				var data = res.data;
				switch (data.retcode) {
					case 0:
						if (data.retdata.total > 0) {
							let dataFormat = data.retdata.advertise;

							self.data = dataFormat.map(function(item) {
								let region = item.region.split(','),
									reg = /\'(.*?)\'/,
									len = region.length,
									regionFormat = '';
								region.forEach(function(str, index) {
									regionFormat += (str.match(reg)[1]);
									if(index != len - 1) {
										regionFormat += '、';
									}
								});
								item.region = regionFormat;
								return item;
							});

							self.total = data.retdata.total;
						}

						this.$Loading.finish();
						break;
					default:
						self.$Message.error(data.retmsg);
						this.$Loading.error();
				}
			});
		},
		search() {
			this.page = 1;
			this.page_size = 10;
			this.total = 0;
			this.loadData();
		},
		changePage(res) {
			this.page = res;
			this.loadData();
		},
		changePageSize(res) {
			this.page_size = res;
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	}
};
</script>
