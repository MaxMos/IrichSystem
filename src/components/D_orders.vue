<style scoped>
.pageCountBox {
    margin: 20px 0 0 20px;
    overflow: hidden;
}

.container {
    margin: 20px 0;
}

.searchBox {
    float: right;
    vertical-align: top;
    display: inline-block;
    width: 300px;
}

.clrFix:before {
    content: '';
    height: 0;
    display: block;
    clear: both;
    visibility: hidden
}
</style>

<template>
<div>
    <div class="ivu-article">
        <blockquote>
            <p class="clrFix">
                <Button type="ghost" icon="help-circled" @click="modal3 = true">服务订单相关说明</Button>
                <span class="searchBox">
                    <Input v-model="searchVal" placeholder="请输入查询内容" @on-blur="search">
                        <Select v-model="searchType" slot="prepend" style="width: 80px">
                            <Option value="no">订单号</Option>
                            <Option value="phone">买家电话</Option>
                        </Select>
                    <Button slot="append" icon="ios-search" @click="search"></Button>
                    </Input>
                </span>
            </p>
        </blockquote>
    </div>
    <Table :context="self" :columns="columns2" :data="data4" border>
    </Table>
    <div class="pageCountBox">
        <div style="float: right;">
            <Page v-bind:total="pageNum" v-bind:current="pageNow" v-bind:page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
    <Modal v-model="modal3" width="1000">
        <h2>服务订单流程说明</h2>
        <div class="container">
            <Steps :current="0" size="small">
                <Step title="客户下单" content="客户在优碳网下意向单"></Step>
                <Step title="确认订单" content="协商确认成交价格、上传合同"></Step>
                <Step title="客户支付" content="客户确认订单并支付，款项由优碳网托管"></Step>
                <Step title="进行服务" content="进行服务，完成后提交“完成服务”状态"></Step>
                <Step title="客户验收服务" content="客户验收服务、提交评价"></Step>
                <Step title="优碳网打款" content="优碳网将款项打到服务商账户"></Step>
            </Steps>
        </div>
        <h2>订单状态说明</h2>
        <div class="container">
            <p>
                <Tag type="dot" color="red">红色状态</Tag>
                <span>：该状态为需服务商进行线上操作才能进行下一步的订单状态，因此请服务商及时处理；</span>
            </p>
            <p>
                <Tag type="dot" color="blue">蓝色状态</Tag>
                <span>：该状态表示订单已进入正常流程，不需服务商进行线上操作；</span>
            </p>
            <p>
                <Tag type="dot" color="green">绿色状态</Tag>
                <span>：该状态表示订单已完成所有流程，优碳网已打款至服务商账户；</span>
            </p>
            <p>
                <Tag type="dot" color="yellow">黄色状态</Tag>
                <span>：该状态表示订单已进入退款流程，请服务商及时关注并积极配合优碳网。</span>
            </p>
        </div>
        <h2>其他说明</h2>
        <div class="container">
            <p>如在使用优碳网服务商中心过程中有任何疑问，可致电优碳网客服：<strong>0755-86936317</strong>，我们将第一时间为你进行解答与技术支持。感谢你对优碳网的支持！</p>
        </div>
    </Modal>
    <Modal
        v-model="modal_price"
        @on-ok="submit">
        <p slot="header">
            <span>{{order.choose === "price" ? "修改价格" : "修改退款金额"}}</span>
        </p>
        <div class="ivu-input-wrapper ivu-input-type ivu-input-group ivu-input-group-with-prepend">
            <div class="ivu-input-group-prepend"><span data-v-9a74e926="">{{order.choose === "price" ? "价格" : "退款金额"}}</span></div>
                <i class="ivu-icon ivu-icon-load-c ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
             <input type="number" placeholder="" class="ivu-input" min="0" v-model="order.price" v-if="order.choose === 'price'"> 
             <input type="number" placeholder="" class="ivu-input" min="0" v-model="order.refund" v-if="order.choose === 'refund'"> 
        </div>
        <br>
        <Input v-model="order.description">
            <span slot="prepend">备注</span>
        </Input>
    </Modal>
    <Modal
        v-model="modal_service"
        title="完成服务"
        @on-ok="confirmService">
        <div>
            <p>确定完成服务{{order.id}}吗？</p>
            <p>一经确认将<span style="background-color: red; color: #fff">无法修改！</span></p>
        </div>
    </Modal>
    <Modal
        v-model="modal_loadFile"
        title="下载附件"
        @on-ok="confirmLoadFile">
        <div>
            <p>确定下载{{order.originalName }}吗？</p>
        </div>
    </Modal>
    <Modal
        v-model="modal_refund"
        title="退款确认"
        @on-ok="confirmRefund">
        <div>
            <Input v-model="order.description" type="textarea" placeholder="备注">
            </Input>
        </div>
    </Modal>
    <Modal v-model="modal_log" title="订单日志" width="1000">
        <div>
            <Table :context="self" :columns="columns1" :data="orderLog" border>
            </Table>
        </div>
        <div slot="footer">
        </div>
    </Modal>
    <Modal v-model="modal_reLoadFile" title="重传附件">
        <div>
            <Upload
             :on-success="handleSuccess"
             :data = "{id : order.id}"
             action="/Interface/reUploadAttachment">
                <i-button type="ghost" size="small">选择文件</i-button>
            </Upload>
        </div>
        <div slot="footer">
        </div>
    </Modal>
</div>
</template>

<script>
export default {
    data() {
        return {
            self: this,
            modal3: false,
            modal_price : false,
            modal_loadFile : false,
            modal_service : false,
            modal_refund : false,
            modal_reLoadFile : false,
            modal_log : false,
            pageNum: 0, //总的条数
            pageNow: 1, //当前页数
            pageTotal: 1, // 全部页数
            pageSize: 5, //每页显示条数
            searchType: 'no',
            searchVal: '',
            columns2: [{
                    title: 'id',
                    key: 'id',
                    width: 100,
                    sortable: true
                },
                {
                    title: '下单时间',
                    key: 'createDate',
                    width: 150,
                    sortable: true
                },
                {
                    title: '订单号',
                    key: 'no',
                    width: 160,
                    sortable: true
                },
                {
                    title: '商品名称',
                    key: 'productName',
                    width: 280,
                    sortable: true
                },
                {
                    title: '所选规格',
                    key: 'standard',
                    width: 150,
                    sortable: true
                },
                {
                    title: '交易价格',
                    key: 'price',
                    width: 120,
                    sortable: true
                },
                {
                    title: '买家名称',
                    key: 'name',
                    width: 200,
                },
                {
                    title: '买家电话',
                    key: 'phone',
                    width: 120
                },
                {
                    title: '附件',
                    key: 'originalName',
                    fixed: 'right',
                    width: 132,
                    render(row) {
                        let ctrl;
                        switch (row.status) {
                            case 0:
                                ctrl = row.originalName == null ? `<Upload
                                                         :on-success="handleSuccess"
                                                         :data = "{id : row.id}"
                                                         action="/Interface/uploadAttachment">
                                                            <i-button type="ghost" icon="ios-cloud-upload-outline">上传文件</i-button>
                                                        </Upload>` : `<p style="cursor:pointer;" @click="loadFile(row.id,row.originalName)">{{row.originalName}}</p>`;
                                break;
                            default :
                                ctrl = row.originalName == null ? `` : `<p style="cursor:pointer;" @click="loadFile(row.id,row.originalName)">{{row.originalName}}</p>`;;
                                break;
                        }
                        return ctrl;
                    }
                },
                {
                    title: '订单状态',
                    key: 'status',
                    fixed: 'right',
                    width: 150,
                    sortable: true,
                    render(row) {
                        let color, text;
                        switch (row.status) {
                            case 0:
                                color = 'red';
                                text = '待确认';
                                break;
                            case 1:
                                color = '';
                                text = '待支付';
                                break;
                            case 2:
                                color = row.offStatus < 2 ? 'red' : '';
                                text = row.offStatus < 2 ? '待服务' : '待验收';
                                break;
                            case 3:
                                color = 'blue';
                                text = '待打款';
                                break;
                            case 4:
                                color = 'green';
                                text = '已打款';
                                break;
                            case 5:
                                color = 'yellow';
                                text = '退款中';
                                break;
                            case 6:
                                color = 'yellow';
                                text = '退款已确认';
                                break;
                            case 7:
                                color = 'yellow';
                                text = '已退款';
                                break;
                        }
                        return color == '' ? `<tag type="dot" style="width:120px;">${text}</tag>` : `<tag type="dot" style="width:120px;" color="${color}">${text}</tag>`;
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 170,
                    render(row) {
                        let ctrl;
                        switch (row.status) {
                            case 0:
                                ctrl = `<i-button type="primary" size="small" @click="changePrice(row.price, row.id)">修改价格</i-button> `;
                                break;
                            case 2:
                                ctrl = row.offStatus < 2 ? `<i-button type="success" size="small" @click="finishServer(row.id)">完成服务</i-button> ` : ``;
                                break;
                            case 5:
                                ctrl = `<i-button type="error" size="small" @click="changeRefund(row.id)">退款金额</i-button>
                                        <i-button type="error" size="small" @click="finishRefund(row.id)">退款确认</i-button>`;
                                break;
                            case 1:
                            case 3:
                            case 4:
                            case 6:
                            case 7:
                                ctrl = ``;
                                break;
                        }
                        ctrl = ctrl + (row.originalName == null ? `` : `<i-button type="ghost" size="small" @click="reLoadFile(row.id)">重传文件</i-button>`);
                        return ctrl + `<i-button type="ghost" size="small" @click="viewOrderLog(row.id)">查看日志</i-button>`;
                    }
                }
            ],
            columns1: [
                {
                    title: '订单ID',
                    key: 'orderId'
                },
                {
                    title: '记录类型',
                    key: 'type'
                },
                {
                    title: '备注',
                    key: 'description'
                }
                ,
                {
                    title: '创建时间',
                    key: 'createDate'
                }
            ],
            data4: [],
            orderList : [],
            tempOrderList : [],
            order: {}, //具体订单
            orderLog : []
        }
    },
    mounted : function(){
        let _this = this;
         _this.$http.post("/Interface/queryOrderInfo", {
        }).then(function(res) {
             let data = res.data;
             switch (data.retcode) {
                case 0:
                    _this.orderList = data.retdata;
                    _this.tempOrderList = data.retdata;
                    _this.pageNum = data.retdata.length;
                    _this.pageTotal = Math.ceil(_this.pageNum/_this.pageSize);
                    _this.data4 = [];
                    if(_this.pageTotal<2){
                        _this.data4 = _this.tempOrderList;
                    }else{
                        for(let i =0 ; i<_this.pageNow*_this.pageSize ; i++){
                            _this.data4.push(_this.tempOrderList[i]);
                        }
                    }
                    break;
                default:
                    _this.$Message.error(data.retmsg);
                    break;
            }
        });
    },
    methods: {
        changePage(page) {
            //page为改变的页面
            this.pageNow = page;
            this.pageNum = this.tempOrderList.length;
            this.pageTotal = Math.ceil(this.pageNum/this.pageSize);
            this.data4 = [];
            if(this.pageNow == this.pageTotal){
                for(let i = (this.pageNow -1)*this.pageSize ; i<this.pageNum ; i++){
                    this.data4.push(this.tempOrderList[i]);
                }
            }else{
                for(let i = (this.pageNow -1)*this.pageSize ; i<this.pageNow*this.pageSize ; i++){
                    this.data4.push(this.tempOrderList[i]);
                }
            }
           
        },
        finishServer(id){
            this.modal_service = !this.modal_service;
            this.order = {};
            this.order.id = id;
        },
        confirmService(){
            let _this = this;
             _this.$http.post("/Interface/finishService", {
                    id          :        _this.order.id
            }).then(function(res) {
                 let data = res.data;
                 switch (data.retcode) {
                    case 0:
                        _this.data4.forEach(function(o, index){
                            if(o.id == _this.order.id ){
                                _this.data4[index].offStatus = 2;
                                return;
                            }
                        });
                        break;
                    default:
                        _this.$Message.error(data.retmsg);
                        break;
                }
            });
        },
        changePrice(price,id){
            this.modal_price = !this.modal_price;
            this.order = {};
            this.order.price = price;
            this.order.choose = "price";
            this.order.price_old = price;
            this.order.id = id;
            this.order.description = '';
        },
        submit(){
            let _this = this;
            if(_this.order.choose === "price"){
                 _this.$http.post("/Interface/changePrice", {
                        id          :        _this.order.id,
                        price       :        _this.order.price,
                        price_old   :        _this.order.price_old,
                        description :        _this.order.description ? _this.order.description : ''
                }).then(function(res) {
                     let data = res.data;
                     switch (data.retcode) {
                        case 0:
                            _this.$Message.success(data.retmsg);
                            _this.data4.forEach(function(o, index){
                                if(o.id == _this.order.id ){
                                    _this.data4[index].price = _this.order.price;
                                    return;
                                }
                            });
                            break;
                        default:
                            _this.$Message.error(data.retmsg);
                            break;
                    }
                });
            }
            if(_this.order.choose === "refund"){
                 _this.$http.post("/Interface/changeOrderRefund", {
                        id          :        _this.order.id,
                        refund      :        _this.order.refund,
                        refund_old  :        _this.order.refund_old,
                        description :        _this.order.description ? _this.order.description : ''
                }).then(function(res) {
                     let data = res.data;
                     switch (data.retcode) {
                        case 0:
                            _this.$Message.success(data.retmsg);
                            _this.data4.forEach(function(o, index){
                                if(o.id == _this.order.id ){
                                    _this.data4[index].refund = _this.order.refund;
                                    return;
                                }
                            });
                            break;
                        default:
                            _this.$Message.error(data.retmsg);
                            break;
                    }
                });
            }
        },
        viewOrderLog(id){
            this.orderLog = [];
            let _this = this;
             _this.$http.post("/Interface/orderLog", {
                    id          :        id
            }).then(function(res) {
                 let data = res.data;
                 switch (data.retcode) {
                    case 0:
                        _this.modal_log = !_this.modal_log;
                        data.retdata.forEach(function(o, index){
                            switch (o.type){
                                case 1:
                                    data.retdata[index].type = "价格改动";
                                    break;
                                case 2:
                                    data.retdata[index].type = "订单普通状态变动";
                                    break;
                                case 3:
                                    data.retdata[index].type = "订单线下状态变动";
                                    break;
                                case 4:
                                    data.retdata[index].type = "退款博弈";
                                    break;
                                case 5:
                                    data.retdata[index].type = "评价";
                                    break;
                                case 6:
                                    data.retdata[index].type = "删除订单";
                                    break;
                                case 7:
                                    data.retdata[index].type = "上传附件";
                                    break;
                                case 8:
                                    data.retdata[index].type = "删除附件";
                                    break;
                                case 9:
                                    data.retdata[index].type = "下载附件";
                                    break;
                                default:
                                    break;

                            }
                        });
                        _this.orderLog = data.retdata;
                        break;
                    default:
                        _this.$Message.error(data.retmsg);
                        break;
                }
            });
        },
        changeRefund(id){
            let _this = this;
            this.modal_price = !this.modal_price;
            this.order = {};
            this.order.choose = "refund";
            this.order.id = id;
            this.order.description = '';
            this.data4.forEach(function(o){
                if(o.id === id){
                    _this.order.refund = o.refund;
                    _this.order.refund_old = o.refund;
                    return;
                }
            });
        },
        finishRefund(id){
            let _this = this;
            this.modal_refund = !this.modal_refund;
            this.order = {};
            this.order.id = id;
            this.order.description = '';
            this.data4.forEach(function(o){
                if(o.id === id){
                    _this.order.status = o.status;
                    return;
                }
            });
        },
        confirmRefund(){
            let _this = this;
             _this.$http.post("/Interface/confirmOrderRefund", {
                    id          :        _this.order.id,
                    status      :        6,
                    status_old  :        _this.order.status,
                    description :        _this.order.description ? _this.order.description : ''
            }).then(function(res) {
                 let data = res.data;
                 switch (data.retcode) {
                    case 0:
                        _this.$Message.success(data.retmsg);
                        _this.data4.forEach(function(o, index){
                            if(o.id === _this.order.id ){
                                _this.data4[index].status = 6;
                                return;
                            }
                        });
                        break;
                    default:
                        _this.$Message.error(data.retmsg);
                        break;
                }
            });
        },
        loadFile(id,originalName){
            let _this = this;
            this.modal_loadFile = !this.modal_loadFile;
            this.order = {};
            this.order.id = id;
            this.order.originalName = originalName;
            this.data4.forEach(function(o){
                if(o.id === id){
                    _this.order.fileName = o.fileName;
                    return;
                }
            });
        },
        confirmLoadFile(){
            window.location.href = this.order.fileName;
        },
        reLoadFile(id){
            this.modal_reLoadFile = !this.modal_reLoadFile;
            this.order = {};
            this.order.id = id;
        },
        handleSuccess(res, file,fileList) {
            let _this = this;
            let data = res;
            this.data4.forEach(function(o , index){
                if(o.id === _this.order.id){
                    _this.data4[index].originalName = file.name;
                    return;
                }
            });
            switch (data.retcode) {
                case 0:
                    _this.$Message.success(data.retmsg);
                    break;
                default:
                    _this.$Message.error(data.retmsg);
                    break;
            }

        },
        search(){
            if(this.searchType === 'no'){
                let _this = this;
                _this.tempOrderList = this.orderList.filter(function(data){
                     if(_this.searchVal === ''){
                        return true;
                    }else{
                        if(data.no){
                            return data.no.indexOf(_this.searchVal)>=0;
                        }
                    }
                })
                this.pageNow = 1;
                this.pageNum = this.tempOrderList.length;
                this.pageTotal = Math.ceil(this.pageNum/this.pageSize);
                this.data4 = [];
                if(_this.pageTotal<2){
                    _this.data4 = _this.tempOrderList;
                }else{
                    for(let i =0 ; i<_this.pageNow*_this.pageSize ; i++){
                        _this.data4.push(_this.tempOrderList[i]);
                    }
                }
            }
            if(this.searchType === 'phone'){
                let _this = this;
                _this.tempOrderList = this.orderList.filter(function(data){
                    if(_this.searchVal === ''){
                        return true;
                    }else{
                        if(data["phone"]){
                            return data["phone"].indexOf(_this.searchVal)>=0;
                        }
                    }
                })
                this.pageNow = 1;
                this.pageNum = this.tempOrderList.length;
                this.pageTotal = Math.ceil(this.pageNum/this.pageSize);
                this.data4 = [];
                if(_this.pageTotal<2){
                    _this.data4 = _this.tempOrderList;
                }else{
                    for(let i =0 ; i<_this.pageNow*_this.pageSize ; i++){
                        _this.data4.push(_this.tempOrderList[i]);
                    }
                }
            }
        }
    }
}
</script>
