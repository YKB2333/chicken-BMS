<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row class="margin-bottom-10">
                    <Col span="5">
                        <label>用户名: </label>
                        <Input v-model="search.username" placeholder="请输入用户名" style="width: 180px"/>
                    </Col>
                    <Col span="5">
                        <label>手机号: </label>
                        <Input v-model="search.phone" placeholder="请输入手机号" style="width: 180px"/>
                    </Col>
                    <Col span="5">
                        <label>集市: </label>
                        <Select v-model="search.marketId" style="width:180px" placeholder="请选择集市"
                                @on-change="handleChangeMarket" clearable>
                            <Option v-for="maket in option.market" :value="maket.id" :key="maket.id">{{ maket.name }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="5">
                        <label>柚子鸡: </label>
                        <Select v-model="search.chookClsId" style="width:180px" placeholder="请选择柚子鸡"
                                clearable>
                            <Option v-for="chookCls in option.chookCls" :value="chookCls.id" :key="chookCls.id"
                                    :label="chookCls.name">
                                <span>{{ chookCls.name }}</span>
                                <span style="float:right;color:#ccc">【{{chookCls.minValue}}-{{chookCls.maxValue}}】</span>
                            </Option>
                        </Select>
                    </Col>
                    <Col span="4">
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

            <!-- 新增删除 -->
            <Drawer class="add-update-drawer"
                    :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false">
                <Form :model="form.record" ref="formRecord" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="标题: " label-position="left" :label-width="100" prop="title">
                        <Input v-model="form.record.title" placeholder="请输入消息标题" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="公告日期: " label-position="left" :label-width="100" prop="publishDate">
                        <DatePicker v-model="form.record.publishDate" type="date" placeholder="请选择公告日期"
                                    style="width: 300px"/>
                    </FormItem>
                    <FormItem label="消息类型: " label-position="left" :label-width="100" prop="msgType">
                        <Select v-model="form.record.msgType" style="width:200px" placeholder="请选择集市" clearable>
                            <Option v-for="msgType in option.msgTypes" :value="msgType.id" :key="msgType.id">
                                {{msgType.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="消息内容: " label-position="left" :label-width="100" prop="content">
                        <Input v-model="form.record.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="请输入消息内容"/>
                    </FormItem>
                    <FormItem label="备注: " label-position="left" :label-width="100" prop="remark">
                        <Input v-model="form.record.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="请输入备注"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formRecord')">提交
                        </Button>
                        <Button style="margin-left: 8px" @click="handleReset('formRecord')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

        </Card>
    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";

    export default {
        name: "transfer-wait",
        data() {
            return {
                option: {
                    msgTypes: [
                        {id: 'SYS', name: '系统消息'},
                        {id: 'ACT', name: '活动消息'},
                    ],
                    market: [],
                    chookCls: []
                },
                search: {
                    status: 'TRANS_WAIT',
                    page: 1,
                    pageSize: 10,
                    username: null,
                    phone: null,
                    marketId: null,
                    chookClsId: null,
                    dateRange: []
                },
                content: {
                    loading: false,
                    total: 0,
                    records: [],
                    columns: [
                        {
                            title: '区块编号',
                            key: 'blockNo',
                            width: 180,
                        },
                        {
                            title: '转让用户',
                            key: 'username',
                            width: 150,
                        },
                        {
                            title: '手机号',
                            key: 'phone',
                            width: 120,
                        },
                        {
                            title: '柚子鸡',
                            key: 'name',
                            width: 150,
                        },
                        {
                            title: '鸡的价值',
                            key: 'value',
                            width: 120,
                        },
                        {
                            title: '领养时间',
                            key: 'time',
                            render: (h, parmas) => {
                                return h('span', {}, parmas.row.startTime + '-' + parmas.row.endTime)
                            }
                        },
                        {
                            title: '领养周期(天)',
                            key: 'cycle',
                            width: 120,
                            render: (h, params) => {
                                return h('span', {}, params.row.cycle + "天")
                            }
                        },
                        {
                            title: '周期收益率(%)',
                            key: 'changeRatio',
                            width: 120,
                            render: (h, params) => {
                                return h('span', {}, params.row.changeRatio * 100 + "%");
                            }
                        }
                    ]
                },
                form: {
                    title: "新增系统消息",
                    show: false,
                    isAdd: true,
                    record: {},
                    ruleValidate: {
                        title: [
                            {required: true, message: '请输入系统消息', trigger: 'blur'}
                        ],
                        publishDate: [
                            {required: true, message: '请选择公告日期', trigger: 'change', type: 'date'}
                        ],
                        msgType: [
                            {required: true, message: '请选择消息类型', trigger: 'change'}
                        ],
                        content: [
                            {required: true, message: '请输入消息内容', trigger: 'blur'}
                        ],
                    }
                }
            }
        },
        created() {
            this.queryRecords();
            this.queryAllMarket();
        },
        methods: {
            handleSearch() {
                console.info(this.search);
                if (this.search.dateRange && this.search.dateRange.length == 2) {
                    if (this.search.dateRange[0] != "") {
                        this.search.startDate = this.search.dateRange[0];
                    }
                    if (this.search.dateRange[1] != "") {
                        this.search.endDate = this.search.dateRange[1];
                    }
                }
                this.queryRecords();
            },
            handleChangeMarket(marketId) {
                if (marketId) {
                    this.queryChookClsByMarketId(marketId);
                } else {
                    this.option.chookCls = [];
                    this.search.chookClsId = null;
                }
            },
            handleCreate() {
                this.form.title = "新增系统消息";
                this.form.isAdd = true;
                this.form.record = {};
                this.form.show = true;
            },
            handleEidt(row) {
                this.form.title = "更新系统消息";
                this.form.isAdd = false;
                this.form.record = JSON.parse(JSON.stringify(row));
                if (this.form.record.msgType) {
                    this.form.record.msgType = this.form.record.msgType.value;
                }
                this.form.show = true;
            },
            handleRemove(row) {
                this.$Modal.confirm({
                    title: '提醒',
                    content: '<p>确认删除系统消息?</p>',
                    onOk: () => {
                        this.deleteSysMsg(row.id);
                        setTimeout(this.querySysMsg, 1000);
                    },
                    onCancel: () => {
                        this.$Message.info('取消删除操作');
                    }
                });
            },
            handleChangePage(page) {
                this.search.page = page;
                this.queryRecords();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.queryRecords();
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createSysMsg();
                        } else {
                            this.updateSysMsg();
                        }
                        this.form.show = false;
                        setTimeout(this.querySysMsg, 1000);
                    } else {
                        this.$Message.error('验证不通过!');
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            async queryRecords() {
                this.content.loading = true;
                try {
                    let res = await post('api/pomelomgm/transfer/list', this.search);
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
            async createSysMsg() {
                try {
                    let res = await post("api/pomelomgm/sysmsg/add", this.form.record);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("新增成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateSysMsg() {
                try {
                    let res = await post("api/pomelomgm/sysmsg/update/" + this.form.record.id, this.form.record);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("更新成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async deleteSysMsg(id) {
                try {
                    let res = await post("api/pomelomgm/sysmsg/remove/" + id);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("删除成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryAllMarket() {
                try {
                    let res = await get("api/pomelomgm/market/list/all");
                    if (res.status == 1) {
                        this.option.market = res.data;
                    } else {
                        this.option.market = [];
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryChookClsByMarketId(marketId) {
                try {
                    let res = await post("api/pomelomgm/chook/cls/list", {marketId: marketId, status: 'Y'});
                    if (res.status == this.rescode.OK) {
                        this.option.chookCls = res.data.records;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
        }
    }
</script>

<style scoped>

</style>
