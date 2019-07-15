<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>状态: </label>
                        <Select v-model="search.statusType" style="width:200px" placeholder="请选择审核状态" clearable>
                            <Option v-for="statusType in option.statusTypes" :value="statusType.id"
                                    :key="statusType.id">
                                {{statusType.name }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="8">
                        <label>充值时间: </label>
                        <DatePicker v-model="search.dateRange" type="datetimerange" placement="bottom-end"
                                    placeholder="选择充值时间" style="width: 300px" clearable/>
                    </Col>
                    <Col span="6">
                        <label>用户电话: &nbsp;&nbsp;</label>
                        <Input v-model="search.phone" placeholder="请输入用户手机号" style="width: 200px"/>
                    </Col>
                    <Col span="3">
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

            <!-- 审核操作 -->
            <Modal v-model="formAudit.show"
                   :title="formAudit.title"
                   @on-ok="hanldeOkAudit"
                   @on-cancel="handleCancelAudit">
                <RadioGroup v-model="formAudit.audit.statusLabel" type="button">
                    <Radio label="通过"></Radio>
                    <Radio label="不通过"></Radio>
                </RadioGroup>
            </Modal>

            <!-- 大图查看 -->
            <Modal title="查看大图" v-model="img.visible" class-name="fl-image-modal">
                <img :src="img.url" v-if="img.visible" style="width: 100%">
            </Modal>

        </Card>
    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";

    export default {
        name: "millet-detail",
        data() {
            return {
                option: {
                    msgTypes: [
                        {id: 'SYS', name: '系统消息'},
                        {id: 'ACT', name: '活动消息'},
                    ],
                    statusTypes: [
                        {id: 'PREPARE', name: '待审核'},
                        {id: 'SUCCESS', name: '审核成功'},
                        {id: 'FAIL', name: '审核失败'}
                    ],

                },
                search: {
                    page: 1,
                    pageSize: 10,
                    phone: null,
                    statusType: null,
                    startTime: null,
                    endTime: null,
                    dateRange: []
                },
                content: {
                    loading: false,
                    total: 0,
                    records: [],
                    columns: [
                        {
                            title: '充值ID',
                            key: 'id',
                            width: 100
                        },
                        {
                            title: '用户名',
                            key: 'username',
                            width: 100
                        },
                        {
                            title: '手机号',
                            key: 'phone',
                            width: 150
                        },
                        {
                            title: 'EC币账号',
                            key: 'account',
                            width: 200
                        },
                        {
                            title: '充值小米',
                            key: 'amount',
                            width: 130
                        },
                        {
                            title: '审核状态',
                            key: 'status',
                            width: 100,
                            render: (h, params) => {
                                return h('span', {}, params.row.status && params.row.status.name);
                            }
                        },
                        {
                            title: '充值凭证',
                            key: 'imageUrl',
                            width: 200,
                            render: (h, params) => {
                                if (params.row.imageUrl) {
                                    return h('img', {
                                        attrs: {
                                            src: this.baseImgUrl + params.row.imageUrl,
                                        },
                                        style: {
                                            width: '150px',
                                            height: '230px'
                                        },
                                        on: {
                                            click: (e) => {
                                                this.handleBigImg(e.srcElement.currentSrc)
                                            }
                                        }
                                    })
                                }
                            }
                        },
                        {
                            title: '充值时间',
                            key: 'createTime',
                            width: 150
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 150,
                            fixed: 'right',
                            align: 'center',
                            render: (h, params) => {
                                let disabledAudit = false;
                                if (params.row.status && params.row.status.value != "PREPARE") {
                                    disabledAudit = true;
                                }
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            disabled: disabledAudit
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleAudit(params.row)
                                            }
                                        }
                                    }, '审核')
                                ])
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
                },
                formAudit: {
                    title: "小米充值审核",
                    show: false,
                    audit: {
                        id: null,
                        status: null,
                        statusLabel: null,
                    }
                },
                img: {
                    visible: false,
                    url: ''
                }
            }
        },
        created() {
            this.queryRecords();
        },
        methods: {
            handleBigImg(url) {
                this.img.url = url;
                this.img.visible = true;
            },
            handleSearch() {
                if (this.search.dateRange && this.search.dateRange.length == 2) {
                    if (this.search.dateRange[0] != "") {
                        this.search.startTime = this.search.dateRange[0];
                    } else {
                        this.search.startTime = null;
                    }
                    if (this.search.dateRange[1] != "") {
                        this.search.endTime = this.search.dateRange[1];
                    } else {
                        this.search.endTime = null;
                    }
                } else {
                    this.search.startTime = null;
                    this.search.endTime = null;
                }
                this.queryRecords();
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
            handleAudit(row) {
                this.formAudit.show = true;
                this.formAudit.audit.id = row.id;
            },
            hanldeOkAudit() {
                if (this.formAudit.audit.statusLabel == "通过") {
                    this.formAudit.audit.status = "SUCCESS";
                    this.audit(this.formAudit.audit.id, this.formAudit.audit.status);
                    setTimeout(this.queryRecords(), 1000);
                } else if (this.formAudit.audit.statusLabel == "不通过") {
                    this.formAudit.audit.status = "FAIL";
                    this.audit(this.formAudit.audit.id, this.formAudit.audit.status);
                    setTimeout(this.queryRecords(), 1000);
                } else {
                    this.$Message.error("请选择审核结果！");
                }
                this.formAudit.show = false;
                this.formAudit.audit = {
                    id: null,
                    status: null,
                    statusLabel: null
                };
            },
            handleCancelAudit() {
                this.formAudit.show = false;
                this.formAudit.audit = {
                    id: null,
                    status: null,
                    statusLabel: null
                };
                this.$Message.info("取消审核操作");
            },
            handleRemove(row) {
                this.$Modal.confirm({
                    title: '提醒',
                    content: '<p>确认删除系统消息?</p>',
                    onOk: () => {
                        this.deleteSysMsg(row.id);
                        setTimeout(this.queryRecords, 1000);
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
                        setTimeout(this.queryRecords, 1000);
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
                    let res = await post('api/pomelomgm/millet-detail/list', this.search);
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
            async audit(id, statusType) {
                try {
                    let res = await get(`api/pomelomgm/millet-detail/audit?id=${id}&statusType=${statusType}`);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("审核成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            }
        }
    }
</script>

<style scoped>

</style>
