<template>
    <div>
        <!-- 数据查询 -->
        <div class="margin-bottom-10">
            <Row class="margin-bottom-10">
                <Col span="6">
                    <label>买家名称: &nbsp;&nbsp;</label>
                    <Input v-model="search.buyUserName" placeholder="请输入买家名称" style="width: 200px"/>
                </Col>
                <Col span="6">
                    <label>卖家名称: &nbsp;&nbsp;</label>
                    <Input v-model="search.sellUserName" placeholder="请输入卖家名称" style="width: 200px"/>
                </Col>
                <Col span="6">
                    <label>订单时间: &nbsp;&nbsp;</label>
                    <DatePicker v-model="search.dataRange" format="yyyy-MM-dd" type="daterange" placement="bottom-end"
                                placeholder="请输入时间范围" style="width: 200px"></DatePicker>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <label>买家电话: &nbsp;&nbsp;</label>
                    <Input v-model="search.buyUserPhone" placeholder="请输入买家电话" style="width: 200px"/>
                </Col>
                <Col span="6">
                    <label>卖家电话: &nbsp;&nbsp;</label>
                    <Input v-model="search.sellUserPhone" placeholder="请输入卖家电话" style="width: 200px"/>
                </Col>
                <Col span="6">
                    <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                </Col>
            </Row>
        </div>

        <!-- 数据展示 -->
        <div class="chook-cls-list" style="overflow: hidden">
            <Table border :loading="content.loading" :columns="content.columns" :data="content.records"></Table>
            <div class="margin-top-8"></div>
            <Page :total="content.total" @on-change="handleChangePage" @on-page-size-change="handleChangePageSize"
                  show-sizer show-total show-elevator class="margin-right-10"
                  style="display: inline-flex;float: right;"/>
        </div>

        <!-- 查看详情 -->
        <Modal
                v-model="view.show"
                title="交易详情">
            <p>区块编号: {{view.order.blockNo}}</p>
            <p>买方名称: {{view.order.buyUserName}}</p>
            <p>卖方名称: {{view.order.sellUserName}}</p>
            <p>买方凭证:
                <img :src="view.order.buyVoucher" width="150" height="200">
            </p>
            <p>卖方凭证:
                <img :src="view.order.sellVoucher" width="150" height="200">
            </p>
        </Modal>

    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";
    import bus from "../../bus.js";

    export default {
        name: "trade-list-show",
        props: {
            type: {
                type: String,
                default: ""
            },
        },
        created() {
            let self = this;
            if (this.type == "WAIT_PAY") {
                this.queryOrder();
            }
            bus.$on("clickTradeListTab", function (type) {
                if (self.type == type) {
                    self.queryOrder();
                }
            });
        },
        destroyed() {
            bus.$off("clickTradeListTab");
        },
        data() {
            return {
                search: {
                    buyUserName: null,
                    buyUserPhone: null,
                    sellUserName: null,
                    sellUserPhone: null,
                    orderStatus: this.type,
                    startDate: null,
                    endDate: null,
                    dataRange: [],
                    page: 1,
                    pageSize: 10
                },
                content: {
                    loading: false,
                    total: 0,
                    records: [],
                    columns: [
                        {
                            title: '区块编号',
                            key: 'blockNo'
                        },
                        {
                            title: '买家ID',
                            key: 'buyUserId',
                            width: 100,
                        },
                        {
                            title: '买家名称',
                            key: 'buyUserName'
                        },
                        {
                            title: '卖家ID',
                            key: 'sellUserId',
                            width: 100,
                        },
                        {
                            title: '卖家名称',
                            key: 'sellUserName'
                        },
                        {
                            title: '柚子鸡ID',
                            key: 'chookId',
                            width: 100,
                        },
                        {
                            title: '柚子鸡',
                            key: 'chookName'
                        },
                        {
                            title: '价值',
                            key: 'chookValue'
                        },
                        {
                            title: '交易时间',
                            key: 'createTime',
                            width: 150,
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: this.type == "APPEAL" ? 250 : 150,
                            fixed: 'right',
                            align: 'center',
                            render: (h, params) => {
                                let actionList = [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleShowDetail(params.row)
                                            }
                                        }
                                    }, '查看详情')
                                ];
                                if (this.type == "APPEAL") {
                                    actionList.push(h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleAuditPass(params.row)
                                            }
                                        }
                                    }, '通过'));
                                    actionList.push(h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleAuditNoPass(params.row)
                                            }
                                        }
                                    }, '不通过'))
                                }
                                return h('div', actionList);
                            }
                        }
                    ]
                },
                view: {
                    show: false,
                    order: {
                        blockNo: null
                    }
                }
            }
        },
        methods: {
            handleSearch() {
                this.queryOrder();
            },
            handleChangePage(page) {
                this.search.page = page;
                this.queryOrder();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.queryOrder();
            },
            handleShowDetail(row) {
                this.view.order = row;
                if (this.view.order.buyVoucher) {
                    this.view.order.buyVoucher = this.baseImgUrl + this.view.order.buyVoucher;
                }
                if (this.view.order.sellVoucher) {
                    this.view.order.sellVoucher = this.baseImgUrl + this.view.order.sellVoucher;
                }
                this.view.show = true;
            },
            handleAuditPass(row) {
                this.$Modal.confirm({
                    title: '申诉审核通过',
                    content: '<p>该操作不可逆转,确认通过该申诉?</p>',
                    onOk: () => {
                        this.appealAudit(row.id, 'Y');
                    },
                    onCancel: () => {
                        this.$Message.info('取消申诉审核');
                    }
                });
            },
            handleAuditNoPass(row) {
                this.$Modal.confirm({
                    title: '申诉审核不通过',
                    content: '<p>该操作不可逆转,确认不通过该申诉?</p>',
                    onOk: () => {
                        this.appealAudit(row.id, 'N');
                    },
                    onCancel: () => {
                        this.$Message.info('取消申诉审核');
                    }
                });
            },
            async queryOrder() {
                if (this.search.dataRange && this.search.dataRange.length == 2) {
                    this.search.startDate = this.search.dataRange[0] && this.search.dataRange[0].format("yyyy-MM-dd hh:mm:ss");
                    this.search.endDate = this.search.dataRange[1] && this.search.dataRange[1].format("yyyy-MM-dd hh:mm:ss");
                }
                this.content.loading = true;
                try {
                    let res = await post("api/pomelomgm/order/list", this.search);
                    if (res.status == this.rescode.OK) {
                        this.content.total = res.data.total;
                        this.content.records = res.data.records;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
                this.content.loading = false;
            },
            async appealAudit(orderId, status) {
                try {
                    let res = await get("api/pomelomgm/order/appeal/audit?orderId=" + orderId + "&status=" + status);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("审核操作成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                    this.queryOrder();
                } catch (e) {
                    this.$throw(e);
                }
            }
        }
    }
</script>

<style scoped>

</style>
