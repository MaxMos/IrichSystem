<style>
.productList .productImg {
	vertical-align: top;
	margin: 10px 0;
}
</style>

<template>
<div class="productList">
	<div class="ivu-article">
		<blockquote>
			<p class="clrFix">
				<Button type="ghost" icon="plus-circled" @click="toAddProduct">新增服务商品</Button>
			</p>
		</blockquote>
	</div>
	<Table :context="self" :columns="productColumn" :data="productData" stripe>
	</Table>
	<Modal
		v-model="modal"
		title="修改服务">
		<p>对话框内容</p>
		<p>对话框内容</p>
		<p>对话框内容</p>
	</Modal>
</div>
</template>

<script>
import router from "../router";
export default {
	data(){
		var width = window.innerWidth * 0.83 - 210;
		return {
			self				:	this,
			modal				:	false,
			searchType			:	"no",
			searchVal			:	"",
			productColumn		:	[
				{
					title			:	"产品图片",
					key				:	"logo",
					width			:	160,
					render( row ){
						const imgsrc = row.logo;
						return `<img class="productImg" src=${imgsrc} width="120px" height="88px"></img>`;
					}
				},
				{
					title			:	"商品名称",
					key				:	"name",
					width			:	width / 6,
					sortable		:	true
				},
				{
					title			:	"交付方式",
					key				:	"delivery",
					width			:	width / 6,
					sortable		:	true
				},
				{
					title			:	"一级分类",
					key				:	"firstName",
					width			:	width / 6,
					sortable		:	true
				},
				{
					title			:	"二级分类",
					key				:	"secName",
					width			:	width / 6,
					sortable		:	true
				},
				{
					title			:	"三级分类",
					key				:	"thirdName",
					width			:	width / 6,
					sortable		:	true
				},
				{
					title			:	"状态",
					key				:	"status",
					fixed			:	"right",
					width			:	130,
					sortable		:	true,
					render( row ){
						return row.status === 0 ? `<Tag type="dot">未上架</Tag>` : `<Tag type="dot" color="green">上架中</Tag>`;
					}
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 170,
					render( row, columns, index ){
						let ctrl;
						switch( row.status ){
							case 0:
								ctrl = ` <i-button type="primary" @click="onShelves( ${ index } )" size="small">上架</i-button> <i-button @click="delProduct( ${ index } )" type="error" size="small">删除</i-button>`;
								break;
							case 1:
								ctrl = ` <i-button type="warning" @click="offShelves( ${ index } )" size="small">下架</i-button> <Tooltip placement="top"><i-button type="error" size="small" disabled>删除</i-button><div slot="content">请先下架商品</div></Tooltip>`;
								break;
						}
						return `<i-button type="ghost" size="small" @click="editProduct( row )">修改</i-button>` + ctrl;
					}
				}
			],
			productData		:	[]
		};
	},
	mounted : function(){
		let _this = this;
		_this.$http.post("/Interface/queryProductInfo", {
		}).then( function( res ){
			let data = res.data;
			switch ( data.retcode ){
				case 0:
					_this.productData = data.retdata;
					break;
				default:
					_this.$Message.error(data.retmsg);
					break;
			}
		});
	},
	methods: {
		toAddProduct(){
			router.push({
				name	:	"productEdit",
				params	:	{
					productId	:	"add"
				}
			});
		},
		editProduct( obj ){
			router.push({
				name	:	"productEdit",
				params	:	{
					productId	:	obj.id
				}
			});
		},
		onShelves( index ){
			let obj		=	this.productData[ index ],
				_this	=	this;
			_this.$Modal.confirm({
				title		:	"上架商品",
				content		:	"确定上架商品【" + obj.name + "】吗？",
				onOk		:	() => {
					_this.$http.post("/Interface/onShelvesProduct", { productId : obj.id } ).then( function( res ){
						let data = res.data;
						switch ( data.retcode ){
							case 0:
								obj.status = 1;
								_this.$Message.info(data.retmsg);
							break;

							default:
								_this.$Message.error(data.retmsg);
							break;
						}
					});
				}
			});
		},
		offShelves( index ){
			let obj		=	this.productData[ index ],
				_this	=	this;
			_this.$Modal.confirm({
				title		:	"下架商品",
				content		:	"确定下架商品【" + obj.name + "】吗？",
				onOk		:	() => {
					_this.$http.post("/Interface/offShelvesProduct", { productId : obj.id } ).then( function( res ){
						let data = res.data;
						switch ( data.retcode ){
							case 0:
								obj.status = 0;
								_this.$Message.info(data.retmsg);
							break;

							default:
								_this.$Message.error(data.retmsg);
							break;
						}
					});
				}
			});
		},
		delProduct( index ){
			let obj		=	this.productData[ index ],
				_this	=	this;
			_this.$Modal.confirm({
				title		:	"删除商品",
				content		:	"确定删除商品【" + obj.name + "】吗？",
				onOk		:	() => {
					_this.$http.post("/Interface/delProduct", { productId : obj.id } ).then( function( res ){
						let data = res.data;
						switch ( data.retcode ){
							case 0:
								_this.productData.splice( index, 1 );
								_this.$Message.info(data.retmsg);
							break;

							default:
								_this.$Message.error(data.retmsg);
							break;
						}
					});
				}
			});
		}
	}
};
</script>
