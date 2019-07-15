<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row class="margin-bottom-10">
                    <Col span="8">
                        <label>工单类型: </label>
                        <Select v-model="search.type" style="width:200px" placeholder="请选择工单类型" clearable>
                            <Option v-for="status in option.types" :value="status.value" :key="status.value">
                                {{status.label }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="8">
                        <label>标题: </label>
                        <Input v-model="search.title" placeholder="请输入工单标题" style="width: 210px"/>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <label>是否处理: </label>
                        <Select v-model="search.status" style="width:200px" placeholder="请选择处理状态" clearable>
                            <Option v-for="status in option.status" :value="status.value" :key="status.value">
                                {{status.label }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="8">
                        <label>创建时间: </label>
                        <DatePicker v-model="search.dateRange" type="datetimerange" placement="bottom-end"
                                    placeholder="选择创建时间范围" style="width: 280px" clearable/>
                    </Col>
                    <Col span="4">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                        <!--<Button type="info" icon="md-add" @click="handleCreate">新增</Button>-->
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
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formRecord')">提交
                        </Button>
                        <Button style="margin-left: 8px" @click="handleReset('formRecord')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

            <!-- 大图查看 -->
            <Modal title="查看大图" v-model="img.visible" class-name="fl-image-modal">
                <img :src="img.url" v-if="img.visible" style="width: 100%">
            </Modal>

        </Card>
    </div>
</template>

<script>
    import {post} from "../../libs/axios-cfg";
    import UploadImg from "../main/components/upload-img/upload-img";

    export default {
        name: "banner",
        components: {UploadImg},
        data() {
            return {
                option: {
                    status: [
                        {value: 'Y', label: '已处理'},
                        {value: 'N', label: '未处理'},
                    ],
                    types: [
                        {value: 'ADOPT', label: '领养'},
                        {value: 'TOPUP', label: '充值'},
                        {value: 'ACCOUNT', label: '账户'},
                        {value: 'COMMUNITY', label: '社区'},
                        {value: 'OTHER', label: '其他'}
                    ]
                },
                search: {
                    page: 1,
                    pageSize: 5,
                    status: null,
                    type: null,
                    title: null,
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
                            title: '用户名',
                            key: 'username',
                            width: 100,
                        },
                        {
                            title: '用户手机号',
                            key: 'userPhone',
                            width: 150
                        },
                        {
                            title: '标题',
                            key: 'title',
                            width: 200
                        },
                        {
                            title: '活动描述',
                            key: 'desc',
                            width: 300
                        },
                        {
                            title: '工单分类',
                            key: 'type',
                            width: 100,
                            render: (h, params) => {
                                return h('span', {}, params.row.type && params.row.type.name);
                            }
                        },
                        {
                            title: '工单图片',
                            key: 'image',
                            width: 180,
                            render: (h, params) => {
                                if (params.row.image) {
                                    return h('img', {
                                        attrs: {
                                            src: this.baseImgUrl + params.row.image,
                                        },
                                        style: {
                                            width: '150px',
                                            height: '150px'
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
                            title: '状态',
                            key: 'status',
                            width: 100,
                            render: (h, params) => {
                                return h('span', {}, params.row.status && params.row.status.name);
                            }
                        },
                        {
                            title: '创建时间',
                            key: 'createTime',
                            width: 150
                        },
                        {
                            title: '活动描述',
                            key: 'action',
                            width: 150,
                            fixed: 'right',
                            align: 'center',
                            render: (h, params) => {
                                let disposeShow = "标记为已处理";
                                if (params.row.status && params.row.status.value == "Y") {
                                    disposeShow = "标记为未处理";
                                }
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
                                                this.handleDispose(params.row)
                                            }
                                        }
                                    }, disposeShow)
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
                        status: [
                            {required: true, message: '请选择横幅状态', trigger: 'change'}
                        ]
                    }
                },
                img: {
                    visible: false,
                    url: ''
                },
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
                if (this.form.record.status) {
                    this.form.record.status = this.form.record.status.value;
                }
                this.form.show = true;
            },
            handleDispose(row) {
                let uRow = JSON.parse(JSON.stringify(row));
                if (uRow.status && uRow.status.value == "Y") {
                    uRow.status = "N";
                } else {
                    uRow.status = "Y";
                }
                if (uRow.type) {
                    uRow.type = uRow.type.value;
                }
                this.updateStatus(uRow);
                setTimeout(this.queryRecords, 1000);
            },
            handleRemove(row) {
                this.$Modal.confirm({
                    title: '提醒',
                    content: '<p>确认删除横幅记录?</p>',
                    onOk: () => {
                        this.deleteRecord(row.id);
                        setTimeout(this.queryRecords, 1000);
                    },
                    onCancel: () => {
                        this.$Message.info('取消删除操作');
                    }
                });
            },
            handleChangeBanners(banners) {
                this.form.record.banners = banners;
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
                            this.createRecord();
                        } else {
                            this.updateRecord();
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
                if (this.search.dateRange && this.search.dateRange.length == 2) {
                    if (this.search.dateRange[0] != '') {
                        this.search.startTime = this.search.dateRange[0];
                    }
                    if (this.search.dateRange[1] != '') {
                        this.search.endTime = this.search.dateRange[1];
                    }
                }
                try {
                    let res = await post('api/pomelomgm/issue/list', this.search);
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
            async createRecord() {
                try {
                    let res = await post("api/pomelomgm/issue/add", this.form.record);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("新增成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateRecord() {
                try {
                    let res = await post("api/pomelomgm/issue/update/" + this.form.record.id, this.form.record);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("更新成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateStatus(row) {
                try {
                    let res = await post("api/pomelomgm/issue/update/" + row.id, row);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("操作成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async deleteRecord(id) {
                try {
                    let res = await post("api/pomelomgm/issue/remove/" + id);
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
