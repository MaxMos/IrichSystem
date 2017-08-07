<style scoped>
	.tabContainer {
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
<div>
	<Tabs value="base" @on-click="changeTabValue">
		<Tab-pane label="基础信息" name="base" >
			<div class="tabContainer">
				<p><strong>基础信息：</strong>为服务商展现在优碳网上的各类基础信息，请仔细填写。</p>
				<Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="120">
					<div class="itemClassTitle">
						<span>以下为必填项</span>
					</div>
                    <Form-item label="企业名称" prop="name">
						<Input v-model="formItem.name" placeholder="请输入"></Input>
					</Form-item>
                    <Form-item label="企业账号">
						{{formItem.userName}}
					</Form-item>
					<Form-item label="企业LOGO">
						<div class="demo-upload-list" v-for="item in uploadList">
							<template v-if="item.status === 'finished'">
								<img :src="item.url">
								<div class="demo-upload-list-cover">
									<Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
									<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
								</div>
							</template>
							<template v-else>
								<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
							</template>
						</div>
						<Upload
							ref="upload"
							:show-upload-list="false"
							:default-file-list="defaultList"
							:on-success="handleSuccess"
							:format="['jpg','jpeg','png']"
							:max-size="2048"
							:on-format-error="handleFormatError"
							:on-exceeded-size="handleMaxSize"
							:before-upload="handleBeforeUpload"
							type="drag"
							action="/Interface/changeLogo"
							style="display: inline-block;width:58px;">
							<div style="width: 58px;height:58px;line-height: 58px;">
								<Icon type="camera" size="20"></Icon>
							</div>
						</Upload>
					</Form-item>
					<Form-item label="经营范围" prop="scope">
						<Input v-model="formItem.scope" placeholder="请输入"></Input>
					</Form-item>
					<Form-item label="支持地区" prop="province">
						<Button type="primary" @click="state.provinceModal = true" size="small">配置地区</Button>
					</Form-item>
					<Form-item label="支持行业" prop="industry">
						<Button type="primary" @click="state.industryModal = true" size="small">配置行业</Button>
					</Form-item>
					<Form-item label="咨询电话" prop="contactPhone">
						<Input v-model="formItem.contactPhone" placeholder="请输入"></Input>
					</Form-item>
					<Form-item label="详细地址" prop="address">
						<Input v-model="formItem.address" placeholder="请输入"></Input>
					</Form-item>
					<Form-item label="服务商类型" prop="type">
						<Checkbox-group v-model="formItem.type">
							<template v-for="p in types">
								<Checkbox :label="p.name"></Checkbox>
							</template>
						</Checkbox-group>
					</Form-item>
					<div class="itemClassTitle">
						<span>以下为选填项</span>
					</div>
					<Form-item label="服务限制">
						<Input v-model="formItem.timeLimit" placeholder="请输入"></Input>
					</Form-item>
					<Form-item label="咨询限制">
						<Input v-model="formItem.limit" placeholder="请输入"></Input>
					</Form-item>
					<Form-item>
						<Button type="success" size="large" @click="editProfile"  >确定修改</Button>
					</Form-item>
				</Form>
			</div>
		</Tab-pane>
		<Tab-pane label="详情介绍" name="description">
			<vue-html5-editor :content="descriptionContent" :height="650" @change="descriptionUpdate"></vue-html5-editor>
			<br>
			<Button type="ghost" size="large" @click="clearContent('descriptionContent')">清空内容</Button>
			<Button type="primary" size="large" style="margin-left: 8px" @click="editRichText">保存内容</Button>
		</Tab-pane>
		<Tab-pane label="成功案例" name="case" >
			<vue-html5-editor :content="caseContent" :height="650" @change="caseUpdate"></vue-html5-editor>
			<br>
			<Button type="ghost" size="large" @click="clearContent('caseContent')">清空内容</Button>
			<Button type="primary" size="large" style="margin-left: 8px" @click="editRichText">保存内容</Button>
		</Tab-pane>
		<Tab-pane label="资质说明" name="qualification">
			<vue-html5-editor :content="qualificationContent" :height="650" @change="qualificationUpdate"></vue-html5-editor>
			<br>
			<Button type="ghost" size="large" @click="clearContent('qualificationContent')">清空内容</Button>
			<Button type="primary" size="large" style="margin-left: 8px" @click="editRichText">保存内容</Button>
		</Tab-pane>
		<Tab-pane label="费用介绍" name="expense">
			<vue-html5-editor :content="expenseContent" :height="650" @change="expenseUpdate"></vue-html5-editor>
			<br>
			<Button type="ghost" size="large" @click="clearContent('expenseContent')">清空内容</Button>
			<Button type="primary" size="large" style="margin-left: 8px" @click="editRichText">保存内容</Button>
		</Tab-pane>
	</Tabs>
	<Modal title="查看图片" v-model="visible">
		<img :src="imgName" v-if="visible" style="display: block;width: 100%;max-width:250px;margin: 0px auto;">
	</Modal>
	<Modal
		v-model="state.provinceModal"
		title="选择地区"
		@on-cancel="">
		<div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAllProvince"
            @click.prevent.native="handleCheckAllProvince">全选</Checkbox>
    </div>
		<Checkbox-group v-model="formItem.province" @on-change="checkAllProvinceChange">
			<template v-for="p in provinces">
				<Checkbox :label="p.name"></Checkbox>
			</template>
		</Checkbox-group>
		<div slot="footer">
			<Button type="primary" size="large" @click="state.provinceModal = false">确定</Button>
		</div>
	</Modal>
	<Modal
		v-model="state.industryModal"
		title="选择行业"
		@on-cancel="">
		<Checkbox-group v-model="formItem.industry">
			<template v-for="p in industrys">
				<Checkbox :label="p.name"></Checkbox>
			</template>
		</Checkbox-group>
		<div slot="footer">
			<Button type="primary" size="large" @click="state.industryModal = false">确定</Button>
		</div>
	</Modal>
</div>
</template>

<script>
export default {
	data() {
		return {
			formItem: {
                name: "",
				scope: "",               // 经营范围
				contactPhone: "",        // 联系电话
				address: "",             // 地址
				province: [],            // 支持地区
				industry: [],            // 支持行业
				type: [],                // 服务商类型
				timeLimit: "",           // 咨询时间限制
				limit: ""                // 服务限制
			},
			ruleValidate: {
				name: [{required: true,  min: 1, message: '企业名称不能为空', trigger: 'change'}],
				scope: [{required: true, message: '经营范围不能为空', trigger: 'blur'}],
				contactPhone: [{required: true, message: '咨询电话不能为空', trigger: 'blur'}],
				address: [{required: true, message: '详细地址不能为空', trigger: 'blur'}],
				province: [{required: true, type: 'array', min: 1, message: '请勾选支持地区', trigger: 'change'}],
				industry: [{required: true, type: 'array', min: 1, message: '请勾选支持行业', trigger: 'change'}],
				type: [{required: true, type: 'array', min: 1, message: '请选择服务商类型', trigger: 'change'}]
			},
			provinces: [],               // 可选省份
			indeterminate: true,
      checkAllProvince: false,
			industrys: [],               // 可选行业
			types: [],                   // 可选类型
			state: {
				provinceModal: false,
				industryModal: false,
				curTab: "base"
			},
			imgName: "",
			visible: false,
			uploadList: [],
			defaultList: [],
			descriptionContent: "",
			caseContent: "",
			qualificationContent: "",
			expenseContent: ""
		};
	},
	computed: {
		provinceId: function(){
			let self = this;
			let temp = [];
			this.provinces.forEach( function( province ){
				if(self.formItem.province.indexOf(province.name) !== -1){
					temp.push(province.id);
				}
			});
			return temp;
		},
		typeId: function(){
			let self = this;
			let temp = [];
			this.types.forEach( function( type ){
				if(self.formItem.type.indexOf( type.name ) !== -1){
					temp.push(type.id);
				}
			});
			return temp;
		},
		industryId: function(){
			let self = this;
			let temp = [];
			this.industrys.forEach( function( industry ){
				if(self.formItem.industry.indexOf( industry.name ) !== -1){
					temp.push(industry.id);
				}
			});
			return temp;
		}
	},
	methods: {
		changeTabValue( value ){
			this.state.curTab = value;
		},

		handleCheckAllProvince(){
        if (this.indeterminate) {
            this.checkAllProvince = false;
        } else {
            this.checkAllProvince = !this.checkAllProvince;
        }
        this.indeterminate = false;

        if (this.checkAllProvince) {
						let temp = [];
						this.provinces.forEach( function( province ){
								temp.push(province.name);
						});
            this.formItem.province = temp;
        } else {
            this.formItem.province = [];
        }
    },
		checkAllProvinceChange(data){
				let length = this.provinces.length;
				if (data.length === length) {
						this.indeterminate = false;
						this.checkAllProvince = true;
				} else if (data.length > 0) {
						this.indeterminate = true;
						this.checkAllProvince = false;
				} else {
						this.indeterminate = false;
						this.checkAllProvince = false;
				}
		},

		handleView( file ){
			this.imgName = file.url;
			this.visible = true;
		},
		handleRemove( file ){
			// 从 upload 实例删除数据
			const fileList = this.$refs.upload.fileList;
			this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
			this.uploadList.pop();
		},
		handleSuccess( res, file ){
			file.url = res.retdata.replace( /&amp;/g, "&" );
			file.name = "logo";
			file.status = "finished";
			this.uploadList.push( file );

			this.$Notice.success({
				title: "修改Logo成功。"
			});
		},
		handleFormatError( file ){
			this.$Notice.warning({
				title: "文件格式不正确",
				desc: "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
			});
		},
		handleMaxSize( file ){
			this.$Notice.warning({
				title: "超出文件大小限制",
				desc: "文件 " + file.name + " 太大，不能超过 2M。"
			});
		},
		handleBeforeUpload(){
			const check = this.uploadList.length < 1;
			if( !check ){
				this.$Notice.warning({
					title: "先删除旧logo。"
				});
			}
			return check;
		},

		// 处理富文本插件
		descriptionUpdate( data ){
			this.descriptionContent = data;
		},
		caseUpdate( data ){
			this.caseContent = data;
		},
		qualificationUpdate( data ){
			this.qualificationContent = data;
		},
		expenseUpdate( data ){
			this.expenseContent = data;
		},
		clearContent( name ){
			this[name] = "";
		},

		// 服务器交互
		editProfile(){
			let obj = {
                name            :   this.formItem.name,
				scope			:	this.formItem.scope,
				contactPhone	:	this.formItem.contactPhone,
				address			:	this.formItem.address,
				provinceId		:	this.provinceId.slice(),
				industryId		:	this.industryId.slice(),
				typeId			:	this.typeId.slice(),
				timeLimit		:	this.formItem.timeLimit,
				limit			:	this.formItem.limit
			};
			this.$refs["formItem"].validate((valid) => {
          if (valid) {
                this.$http.post( "/Interface/editBase", obj ).then( function( res ){
                    if(res.data.retcode === 0){
                        this.$Notice.success({
                            title: "保存成功"
                        });
                    } else {
                        this.$Notice.error({
                            title: res.data.retmsg
                        });
                    }
                });
          } else {
              this.$Message.error('您填写的信息有错误哦，请仔细检查！');
          }
      });

		},

		editRichText(){
			let tab = this.state.curTab,
				type,
				content;

			switch( tab ){
				case "description":
					content = this.descriptionContent;
					type = 1;
				break;
				case "case":
					content = this.caseContent;
					type = 2;
				break;
				case "qualification":
					content = this.qualificationContent;
					type = 3;
				break;
				case "expense":
					content = this.expenseContent;
					type = 4;
				break;

			}
			this.$http.post("/Interface/saveHtml", {
				type: type,
				content: content
			}).then( function( res ){
				if(res.data.retcode === 0){
					this.$Notice.success({
						title: "保存成功"
					});
				} else {
					this.$Notice.error({
						title: res.data.retmsg
					});
				}
			});
		}
	},
	mounted(){
		this.uploadList = this.$refs.upload.fileList;

		this.$http.post("/Interface/queryProvince").then( function( res ){
			this.provinces = res.body.retdata;
		});

		this.$http.post("/Interface/queryIndustry").then( function( res ){
			this.industrys = res.body.retdata;
		});

		this.$http.post("/Interface/queryType").then( function( res ){
			this.types = res.body.retdata;
		});

		let self = this;
		// 获取基本信息
		this.$http.post("/Interface/queryDetail", {
			id: 29
		}).then( function( res ){
			if( !res.body.retdata ){
				this.$Notice.error({
					title: "获取数据失败，请刷新",
					duration: 0
				});
			}
			let data = res.body.retdata ? res.body.retdata : {};
			let i;

			self.uploadList.push({
				url: data.logo,
				status: "finished",
				name: "logo"
			});
			// 输入框部分
			[ "name", "userName", "limit", "timeLimit", "address", "contactPhone", "scope" ].forEach(function( i ){
				self.formItem[ i ] = data[ i ];
			});
			self.imgName = data.logo;

			// 选择框部分

			data.province.forEach(function( item ){
				self.formItem.province.push(item.name);
			});

			data.industry.forEach(function( item ){
				self.formItem.industry.push(item.name);
			});

			data.type.forEach(function( item ){
				self.formItem.type.push(item.name);
			});

			// 富文本部分
			self.descriptionContent		=	data.detail ? data.detail : "";
			self.caseContent			=	data.example ? data.example : "";
			self.qualificationContent	=	data.achivement ? data.achivement : "";
			self.expenseContent			=	data.brief ? data.brief : "";
		});
	}
};
</script>
