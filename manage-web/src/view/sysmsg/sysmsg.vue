<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>标题: </label>
                        <Input v-model="search.title" placeholder="请输入消息标题" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>类型: </label>
                        <Select v-model="search.msgType" style="width:200px" placeholder="请选择集市" clearable>
                            <Option v-for="msgType in option.msgTypes" :value="msgType.id" :key="msgType.id">
                                {{msgType.name }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <label>公告日期: </label>
                        <DatePicker v-model="search.dateRange" type="daterange" placement="bottom-end"
                                    placeholder="选择公告日期" style="width: 200px" clearable/>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
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
                    <FormItem label="是否弹框: " label-position="left" :label-width="100" prop="dialogShow">
                        <Select v-model="form.record.dialogShow" style="width:200px" placeholder="是否弹框" clearable>
                            <Option v-for="dialogShow in option.dialogShows" :value="dialogShow.id" :key="dialogShow.id">
                                {{dialogShow.name }}
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
    import {post} from "../../libs/axios-cfg";

    export default {
        name: "sysmsg",
        data() {
            return {
                option: {
                    msgTypes: [
                        {id: 'SYS', name: '系统消息'},
                        {id: 'ACT', name: '活动消息'},
                    ],
                    dialogShows: [
                        {id: 'Y', name: "弹框"},
                        {id: 'N', name: "不弹框"}
                    ]
                },
                search: {
                    page: 1,
                    pageSize: 10,
                    title: null,
                    publishStartDate: null,
                    publishEndDate: null,
                    msgType: null,
                    dateRange: []
                },
                content: {
                    loading: false,
                    total: 0,
                    records: [],
                    columns: [
                        {
                            title: '消息ID',
                            key: 'id',
                            width: 100
                        },
                        {
                            title: '标题',
                            key: 'title',
                            width: 100
                        },
                        {
                            title: '公告日期',
                            key: 'publishDate',
                            width: 100
                        },
                        {
                            title: '消息类型',
                            key: 'msgType',
                            width: 100,
                            render: (h, params) => {
                                return h('span', {}, params.row.msgType && params.row.msgType.name)
                            }
                        },
                        {
                            title: '是否弹框',
                            key: 'dialogShow',
                            width: 100,
                            render: (h, params) => {
                                return h('span', {}, params.row.dialogShow && params.row.dialogShow.name)
                            }
                        },
                        {
                            title: '内容',
                            key: 'content',
                            width: 500
                        },
                        {
                            title: '备注',
                            key: 'remark',
                            width: 200
                        },
                        {
                            title: '创建时间',
                            key: 'createTime',
                            width: 150
                        },
                        {
                            title: '更新时间',
                            key: 'updateTime',
                            width: 150
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 150,
                            fixed: 'right',
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
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
                                                this.handleEidt(params.row)
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleRemove(params.row)
                                            }
                                        }
                                    }, '删除'),
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
                        dialogShow: [
                            {required: true, message: '请选择是否弹框', trigger: 'change'}
                        ],
                        content: [
                            {required: true, message: '请输入消息内容', trigger: 'blur'}
                        ],
                    }
                }
            }
        },
        created() {
            this.querySysMsg();
        },
        methods: {
            handleSearch() {
                if (this.search.dateRange && this.search.dateRange.length == 2) {
                    if (this.search.dateRange[0] != "") {
                        this.search.startDate = this.search.dateRange[0];
                    }
                    if (this.search.dateRange[1] != "") {
                        this.search.endDate = this.search.dateRange[1];
                    }
                }
                this.querySysMsg();
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
                if (this.form.record.dialogShow) {
                    this.form.record.dialogShow = this.form.record.dialogShow.value;
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
                this.querySysMsg();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.querySysMsg();
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
            async querySysMsg() {
                this.content.loading = true;
                try {
                    let res = await post('api/pomelomgm/sysmsg/list', this.search);
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
            }
        }
    }
</script>

<style scoped>

</style>
