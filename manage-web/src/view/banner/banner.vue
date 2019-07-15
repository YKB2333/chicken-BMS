<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>状态: </label>
                        <Select v-model="search.status" style="width:200px" placeholder="请选择状态" clearable>
                            <Option v-for="status in option.status" :value="status.id" :key="status.id">
                                {{status.name }}
                            </Option>
                        </Select>
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
                    <FormItem label="横幅图片: " label-position="left" :label-width="100" prop="title">
                        <UploadImg :src="form.record.banners" @changeSrc="handleChangeBanners"/>
                    </FormItem>
                    <FormItem label="公告日期: " label-position="left" :label-width="100" prop="href">
                        <Input v-model="form.record.href" placeholder="请输入横幅跳转地址链接" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="横幅状态: " label-position="left" :label-width="100" prop="status">
                        <Select v-model="form.record.status" style="width:200px" placeholder="请选择横幅状态" clearable>
                            <Option v-for="status in option.status" :value="status.id" :key="status.id">
                                {{status.name }}
                            </Option>
                        </Select>
                    </FormItem>
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
                        {id: 'Y', name: '生效'},
                        {id: 'N', name: '不生效'},
                    ]
                },
                search: {
                    page: 1,
                    pageSize: 10,
                    status: null,
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
                            title: '图片',
                            key: 'banners',
                            align: 'center',
                            render: (h, params) => {
                                return h('img', {
                                    attrs: {
                                        src: this.baseImgUrl + params.row.banners,
                                    },
                                    style: {
                                        width: '300px',
                                        height: '150px'
                                    },
                                    on: {
                                        click: (e) => {
                                            this.handleBigImg(e.srcElement.currentSrc)
                                        }
                                    }
                                });
                            }
                        },
                        {
                            title: '跳转地址',
                            key: 'href',
                            width: 350
                        },
                        {
                            title: '是否生效',
                            key: 'status',
                            width: 100,
                            render: (h, params) => {
                                return h('span', {}, params.row.status.name);
                            }
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
                try {
                    let res = await post('api/pomelomgm/banner/list', this.search);
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
                    let res = await post("api/pomelomgm/banner/add", this.form.record);
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
                    let res = await post("api/pomelomgm/banner/update/" + this.form.record.id, this.form.record);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("更新成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async deleteRecord(id) {
                try {
                    let res = await post("api/pomelomgm/banner/remove/" + id);
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
