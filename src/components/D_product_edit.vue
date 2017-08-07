<style scoped>
.statues {
	padding-bottom: 20px;
	margin-bottom: 20px;
	border-bottom: 1px solid #eee;
}

.container {
	margin: 20px 0;
}

.standardBox {
	padding: 5px 20px;
	margin-bottom: 20px;
	background-color: #f8f8f8;
	border-radius: 3px;
}

.standardBox .item {
	position: relative;
	margin: 20px 0;
	padding: 20px 100px 20px 20px;
	background-color: #fff;
	border: 1px solid #eee;
	border-radius: 3px;
}

.standardBox .closeBtn {
	position: absolute;
	right: 0;
	top: 0;
}

.standardBox .tags {
	margin-top: 10px;
}
.demo-upload-list {
	display: inline-block;
	width: 60px;
	height: 60px;
	text-align: center;
	line-height: 60px;
	border: 1px solid transparent;
	border-radius: 4px;
	overflow: hidden;
	background: #fff;
	position: relative;
	box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
	margin-right: 4px;
}

.demo-upload-list img {
	width: 100%;
	height: 100%;
}

.demo-upload-list-cover {
	display: none;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
	display: block;
}

.demo-upload-list-cover i {
	color: #fff;
	font-size: 20px;
	cursor: pointer;
	margin: 0 2px;
}
</style>

<template>
<div class="editBox">
	<div class="statues">
		<Steps :current="step" >
			<Step title="绑定服务商品类别" content="选择服务商品所属的各级分类进行绑定，便于用户进行筛选"></Step>
			<Step title="编辑基本信息" content="编辑完善服务商品的基本信息和规格价格信息"></Step>
			<Step title="编辑产品详情" content="编辑完善服务商品的详情介绍"></Step>
		</Steps>
	</div>
	<Tabs v-model="tabCur">
		<Tab-pane label="1. 绑定服务商品类别" name="1" :disabled="true" >
			<div class="container">
				<Form :label-width="150">
					<Form-item label="服务产品分类（三级）">
						<Cascader :data="typeData" v-model="type" trigger="hover" size="large"></Cascader>
					</Form-item>
					<Form-item>
						<Button type="primary" size="large" :disabled="!canNext" @click="finishType" >下一步</Button>
					</Form-item>
				</Form>
			</div>
		</Tab-pane>
		<Tab-pane label="2. 编辑基本信息" name="2" :disabled="true" >
			<div class="container">
				<Form :model="detailData" :label-width="100">
					<div class="itemClassTitle">
						<span>基本信息</span>
					</div>
					<Form-item label="产品Logo">
						<div class="demo-upload-list" v-for="item in logo.list">
							<template v-if="item.status === 'finished'">
								<img :src="item.url" />
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
									<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
								</div>
							</template>
							<template v-else>
								<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
							</template>
						</div>
						<Upload
							:show-upload-list="false"
							:on-success="handleSuccess"
							:format="['jpg','jpeg','png']"
							:data="{ type : 'logo' }"
							:max-size="5120"
							:on-format-error="handleFormatError"
							:on-exceeded-size="handleMaxSize"
							:before-upload="handleBeforeUpload"
							type="drag"
							action="/Interface/uploadFile"
							style="display: inline-block;width:58px;">
							<div style="width: 58px;height:58px;line-height: 58px;">
								<Icon type="camera" size="20"></Icon>
							</div>
						</Upload>
					</Form-item>
					<Form-item label="产品类别">
						<Tag type="dot" color="red" >{{ typeShow[ 0 ] }}</Tag> »
						<Tag type="dot" color="green" >{{ typeShow[ 1 ] }}</Tag> »
						<Tag type="dot">{{ typeShow[ 2 ] }}</Tag>
					</Form-item>
					<Form-item label="产品名称" prop="name">
						<Input v-model="detailData.name" placeholder="请输入产品名称"></Input>
					</Form-item>
					<Form-item label="交付方式" prop="delivery">
						<Input v-model="detailData.delivery" placeholder="请输入交付方式"></Input>
					</Form-item>
					<Form-item label="简介" prop="brief">
						<Input v-model="detailData.brief" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
					</Form-item>
					<div class="itemClassTitle">
						<span>规格与价格</span>
					</div>
					<Form-item label="规格">
						<div class="standardBox" v-if="standard.length > 0">
							<div class="item" v-for="(item, i) in standard">
								<Input v-model="item.name" placeholder="请输入规格名称"></Input>
								<div class="tags">
									<Tag type="dot" closable :color="i == 0 ? 'blue' : (i==1 ? 'red' : 'yellow')" v-for="(tag, n) in item.tags" :key="n" @on-close="deleteTags(i,n)">{{tag}}</Tag>
									<Tooltip placement="top" @on-popper-hide="resetTagsVal" v-if="item.tags.length < 3">
										<Button type="ghost" icon="plus">添加候选项</Button>
										<div slot="content" style="width: 310px">
											<Input v-model="detailData.tagsVal" placeholder="请输入候选项" style="width: 172px"></Input>
											<Button type="primary" @click="addTagsVal(i)">确定</Button>
										</div>
									</Tooltip>
								</div>
								<Button class="closeBtn" type="error" icon="close" size="small" @click="deleteStandard(i)"></Button>
							</div>
						</div>
						<div>
							<Button type="ghost" icon="plus-circled" size="large" @click="addStandard" :disabled="standard.length >= 3">添加项目规格</Button>
							<span style="margin-left: 10px;">（至少添加一个规格项目，最多添加三个规格项目，每个规格项目最多添加三个候选项）</span>
						</div>
					</Form-item>
					<Form-item label="价目表">
						<div style="margin-bottom: 20px">
							<Button type="ghost" icon="clipboard" size="large" :disabled="!isStandardChange" @click="priceListInit">生成价目表单</Button>
							<Tag color="red" style="margin-left: 20px" v-if="isStandardChange">
								<Icon type="alert-circled"></Icon> 规格改动后，请重新生成价目表
							</Tag>
						</div>
						<!-- 价目表 Start -->
						<div class="ivu-table-wrapper">
							<div class="ivu-table ivu-table-border">
								<table cellspacing="0" cellpadding="0" border="0" style="width: 100%">
									<thead>
										<tr>
											<th><div class="ivu-table-cell"><span>规格</span></div></th>
											<th><div class="ivu-table-cell"><span>价格类型</span></div></th>
											<th><div class="ivu-table-cell"><span>价格（元）</span></div></th>
											<th><div class="ivu-table-cell"><span>原价（元）</span></div></th>
											<th><div class="ivu-table-cell"><span>优惠信息</span></div></th>
										</tr>
									</thead>
									<tbody class="ivu-table-tbody" v-if="priceList.length == 0">
										<tr class="ivu-table-row" v-if="priceList.length == 0">
											<td colspan="5" style="text-align: center"><span>暂无数据</span></td>
										</tr>
									</tbody>
									<tbody class="ivu-table-tbody" v-if="priceList.length > 0">
										<tr class="ivu-table-row" v-for="(row, n) in priceList">
											<td>
												<div class="ivu-table-cell">
													<div class="ivu-tag ivu-tag-border" v-bind:class="[i == 0 ? 'ivu-tag-blue' : (i==1 ? 'ivu-tag-red' : 'ivu-tag-yellow')]" v-for="(item, i) in row.standardName" :key="i">
														<span class="ivu-tag-text">{{item}}</span>
													</div>
												</div>
											</td>
											<td>
												<div class="ivu-table-cell">
													<Select v-model="row.priceType">
														<Option :value="1">一口价</Option>
														<Option :value="2">面议</Option>
													</Select>
												</div>
											</td>
											<td>
												<div class="ivu-table-cell" v-if="row.priceType == 1">
													<Input v-model="row.price" placeholder="请输入价格"></Input>
												</div>
												<div class="ivu-table-cell" v-if="row.priceType == 2">
													<span>无需填写</span>
												</div>
											</td>
											<td>
												<div class="ivu-table-cell" v-if="row.priceType == 1">
													<Input v-model="row.originPrice" placeholder="请输入原价"></Input>
												</div>
												<div class="ivu-table-cell" v-if="row.priceType == 2">
													<span>无需填写</span>
												</div>
											</td>
											<td>
												<div class="ivu-table-cell">
													<Input v-model="row.promotion" placeholder="请输入优惠信息"></Input>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<!-- 价目表 End -->
					</Form-item>
					<Form-item>
						<Button type="primary" size="large" @click="finishStandard">保存，下一步</Button>
					</Form-item>
				</Form>
			</div>
		</Tab-pane>
		<Tab-pane label="3. 编辑产品详情" name="3" :disabled="true" >
			<vue-html5-editor :content="detailContent" @change="updateContent" :height="500" ></vue-html5-editor>
			<br/>
			<Button type="ghost" size="large" @click="clearContent">清空内容</Button>
			<Button type="primary" size="large" @click="commitContent" style="margin-left: 8px">保存内容</Button>
		</Tab-pane>
	</Tabs>
	<Modal title="查看图片" v-model="logo.visible">
		<img :src="logo.url" v-if="logo.visible" style="width: 100%"/>
	</Modal>
</div>
</template>

<script>
import router from "../router";
export default{
	data(){
		return {
			logo				:	{
				upload			:	false,
				name			:	"",
				visible			:	false,
				list			:	[],
				url				:	""
			},
			step				:	0,
			tabCur				:	"1",
			canNext				:	false,
			typeShow			:	[ "", "", "" ],
			type				:	[],
			standard			:	[],
			isStandardChange	:	false,
			detailContent		:	"",
			detailData			:	{
				name		:	"",
				delivery	:	"",
				brief		:	"",
				tagsVal		:	""
			},
			typeData			:	[],
			priceList			:	[]
		};
	},
	mounted		:	function(){
		let _this	=	this;
		_this.$http.post( "/Interface/queryProductType", {
		}).then( function( res ){
			let data	=	res.data;
			switch( data.retcode ){
				case 0:
					let arr = [], one, two;
					data.retdata.forEach( function( o ){
						one	=	{
							value		:	{
								id		:	o.id,
								name	:	o.name
							},
							label		:	o.name,
							children	:	[]
						};
						o.children.forEach( function( p ){
							two	=	{
								value		:	{
									id		:	p.id,
									name	:	p.name
								},
								label		:	p.name,
								children	:	[]
							};
							p.children.forEach( function( q ){
								two.children.push({
									value	:	{
										id		:	q.id,
										name	:	q.name
									},
									label	:	q.name
								});
							});
							one.children.push( two );
						});
						arr.push( one );
					});
					_this.typeData = arr;
					if( this.$route.params.productId !== "add" ){
						_this.$http.post( "/Interface/queryProductDetail", {
							productId		:	this.$route.params.productId
						}).then( function( res ){
							let data, temp, temp2;
							data	=	res.data;
							switch( data.retcode ){
								case 0:
									data	=	data.retdata;
									_this.typeData.forEach( o => {
										if( o.children && o.children.length ){
											o.children.forEach( p => {
												if( p.children && p.children.length ){
													p.children.forEach( q => {
														if( q.value.id === data.type ){
															_this.type = [ o.value, p.value, q.value ];
														}
													});
												}
											});
										}
									});
									_this.detailData.name		=	data.name;
									_this.detailData.delivery	=	data.delivery;
									_this.detailData.brief		=	data.brief;
									temp						=	data.logo.split( "?" )[ 0 ].split( "/" );
									_this.logo.name				=	temp[ temp.length - 1 ];
									_this.logo.list				=	[
										{
											name	:	temp[ temp.length - 1 ],
											url		:	data.logo,
											status	:	"finished"
										}
									];
									data.standard.forEach( o => {
										temp	=	[];
										o.value.forEach( p => {
											temp.push( p.name );
										});
										_this.standard.push({
											name	:	o.name,
											tags	:	temp
										});
									});
									data.price.forEach( o => {
										temp	=	[];
										temp2	=	[];
										o.standard.forEach( p => {
											data.standard.forEach( q => {
												q.value.forEach( ( r, i ) => {
													if( r.id === p ){
														temp.push( r.name );
														temp2.push( i );
													}
												});
											});
										});
										_this.priceList.push({
											standardName	:	temp,
											standard		:	temp2,
											priceType		:	o.type,
											price			:	o.price,
											originPrice		:	o.origin,
											stock			:	o.stock,
											promotion		:	o.promotion
										});
									});
									_this.detailContent		=	data.detail ? data.detail : "";
								break;

								default:
									_this.$Message.error(data.retmsg);
								break;
							}
						});
					}
				break;

				default:
					_this.$Message.error(data.retmsg);
				break;
			}
		});
	},
	methods		:	{
		handleView( url ){
			this.logo.url		=	url;
			this.logo.visible	=	true;
		},
		handleRemove( file ){
			let list	=	this.logo.list;
			list.splice( list.indexOf( file ), 1 );
		},
		handleSuccess( res, file ){
			let temp;
			if( res.retcode === 0 ){
				file.url			=	"/" + res.retdata;
				file.name			=	res.retdata;
				this.logo.list.push( file );
				this.logo.upload	=	true;
			}else{
				this.$Notice.warning({
					title	:	"上传文件失败"
				});
			}
		},
		handleFormatError( file ){
			this.$Notice.warning({
				title	:	"文件格式不正确",
				desc	:	"文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
			});
		},
		handleMaxSize( file ){
			this.$Notice.warning({
				title	:	"超出文件大小限制",
				desc	:	"文件 " + file.name + " 太大，不能超过 2M。"
			});
		},
		handleBeforeUpload(){
			let check = this.logo.list.length < 1;
			if( !check ){
				this.$Notice.warning({
					title	:	"最多只能上传 1 张图片。"
				});
			}
			return check;
		},
		finishType(){
			this.tabCur		=	"2";
			this.step		=	1;
		},
		finishStandard(){
			if( this.logo.list[ 0 ] && this.logo.list[ 0 ].name && this.priceList.length > 0 && this.detailData.name.length > 0 &&
				this.detailData.brief.length > 0 && this.detailData.delivery.length > 0 ){
				this.tabCur		=	"3";
				this.step		=	2;
			}else{
				this.$Message.error( "请补充各种信息" );
			}
		},
		arrayRemove( arr, n ){
			if( n < 0 ){
				return arr;
			}else{
				return arr.slice( 0, n ).concat( arr.slice( n + 1, arr.length ) );
			}
		},
		addStandard(){
			this.standard.push({
				name	:	"",
				tags	:	[]
			});
		},
		deleteStandard( i ){
			this.standard			=	this.arrayRemove( this.standard, i );
			this.isStandardChange	=	true;
		},
		resetTagsVal(){
			this.detailData.tagsVal	=	"";
		},
		addTagsVal( i ){
			if( this.detailData.tagsVal !== "" ){
				this.standard[i].tags.push( this.detailData.tagsVal );
				this.detailData.tagsVal		=	"";
				this.isStandardChange		=	true;
			}
		},
		deleteTags( i, n ){
			this.standard[i].tags	=	this.arrayRemove(this.standard[i].tags, n);
			this.isStandardChange	=	true;
		},
		priceListInit(){
			let priceList	=	[],
				temp;
			this.standard.forEach( function( o, i ){
				if( i === 0 ){
					o.tags.forEach( function( p, j ){
						priceList.push({
							standardName	:	[ p ],
							standard		:	[ j ],
							priceType		:	1,
							price			:	1,
							originPrice		:	1,
							stock			:	1,
							promotion		:	""
						});
					});
				}else{
					temp	=	[];
					priceList.forEach( function( q ){
						o.tags.forEach( function( p, j ){
							temp.push({
								standardName	:	q.standardName.concat( [ p ] ),
								standard		:	q.standard.concat( [ j ] ),
								priceType		:	1,
								price			:	1,
								originPrice		:	1,
								stock			:	1,
								promotion		:	""
							});
						});
					});
					priceList		=	temp.length > 0 ? temp : priceList;
				}
			});
			this.priceList			=	priceList;
			this.isStandardChange	=	false;
		},
		clearContent(){
			this.detailContent	=	"";
		},
		updateContent( data ){
			this.detailContent	=	data;
		},
		commitContent(){
			let _this	=	this,
				commitData;
			commitData	=	{
				type		:	_this.type[ 2 ].id,
				name		:	_this.detailData.name,
				uploadLogo	:	_this.logo.upload,
				logo		:	_this.logo.list[ 0 ].name,
				delivery	:	_this.detailData.delivery,
				brief		:	_this.detailData.brief,
				standard	:	_this.standard,
				price		:	_this.priceList,
				detail		:	_this.detailContent
			};
			if( this.$route.params.productId !== "add" ){
				commitData.productId	=	this.$route.params.productId;
			}
			_this.$http.post( "/Interface/commitProduct", commitData ).then( function( res ){
				let data	=	res.data;
				switch( data.retcode ){
					case 0:
						router.push({
							name	:	"product"
						});
					break;

					default:
						_this.$Message.error(data.retmsg);
					break;
				}
			});
		}
	},
	watch: {
		type( cur, old ){
			if( cur.length > 0 ){
				this.typeShow	=	[
					cur[ 0 ].name, cur[ 1 ].name, cur[ 2 ].name
				];
				this.canNext	=	true;
			}
		},
		standard( cur, old ){
			if( cur.length > 0 && cur[ 0 ].tags.length > 0 ){
				this.isStandardChange	=	true;
			}
		}
	}
};
</script>
