<template>
    <div>
        <Card>
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>标题: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <Input v-model="search.title" placeholder="标题" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>状态: </label>
                        <Select v-model="search.status" placeholder="请选择所属盟友" style="width: 220px" clearable>
                            <Option value="0" key="0">未上架</Option>
                            <Option value="1" key="1">已上架</Option>
                            <Option value="-1" key="-1">已经下架</Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <label>盟友: </label>
                        <Select v-model="search.allyId" placeholder="请选择所属盟友" style="width: 220px" clearable>
                            <Option v-for="ally in option.allys" :value="ally.id" :key="ally.id">{{ally.name}}</Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="12">
                        <label>创建时间: </label>
                        <DatePicker :value="search.dateRange" format="yyyy-MM-dd" type="daterange" placeholder="创建时间范围"
                                    style="width: 200px"/>
                    </Col>
                </Row>
            </div>

            <!-- 数据列表 -->
            <div class="version-list">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
            </div>

            <!-- 新增修改 -->
            <Drawer
                    :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false"
                    :styles="styles">
                <Form :model="form.version" ref="formAlly" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="所属盟友: " label-position="left" :label-width="80" prop="allyId">
                        <Select v-model="form.version.allyId" placeholder="请选择所属盟友" style="width: 300px" clearable>
                            <Option v-for="ally in option.allys" :value="ally.id" :key="ally.id">{{ally.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="版本标题: " label-position="left" :label-width="80" prop="title">
                        <Input v-model="form.version.title" placeholder="请输入盟友名称" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="版本号: " label-position="left" :label-width="80" prop="pushVersion">
                        <Input v-model="form.version.pushVersion" placeholder="请输入版本号" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="版本简介: " label-position="left" :label-width="80" prop="desc">
                        <Input v-model="form.version.desc" placeholder="请输入版本简介" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="备注: " label-position="left" :label-width="80" prop="remark">
                        <Input v-model="form.version.remark" placeholder="请输入QQ号" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="上传APK: " label-position="left" :label-width="80" prop="image">
                        <UploadDownload :src="form.version.apkUrl" action='/system/upload/file/apk'
                                        @changeFileSrc="handleChangeFileSrc"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formAlly')">提交</Button>
                        <Button style="margin-left: 8px" @click="handleReset('formAlly')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

            <!-- 展示信息 -->
            <Modal v-model="view.show"
                   title="盟友详细信息">
                <p>ID: &nbsp;&nbsp;{{view.version.id}}</p>
                <p>所属盟友: &nbsp;&nbsp;{{view.version.allyId}}</p>
                <p>标题: &nbsp;&nbsp;{{view.version.title}}</p>
                <p>状态: &nbsp;&nbsp;{{view.version.status}}</p>
                <p>简介: &nbsp;&nbsp;{{view.version.desc}}</p>
                <p>版本号: &nbsp;&nbsp;{{view.version.pushVersion}}</p>
                <p>下载地址: &nbsp;&nbsp;{{view.version.apkUrl}}</p>
                <p>文件大小: &nbsp;&nbsp;{{view.version.apkSize}}</p>
                <p>创建时间: &nbsp;&nbsp;{{view.version.createTime}}</p>
                <p>备注: &nbsp;&nbsp;{{view.version.remark}}</p>
            </Modal>
        </Card>
    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";
    import UploadDownload from "../main/components/upload-download/upload-download";
    import accounting from "accounting/accounting";
    import config from "../../config/index"

    export default {
        components: {UploadDownload},
        data() {
            const baseRequestUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
            return {
                baseRequestUrl: baseRequestUrl,
                option: {
                    allys: []
                },
                search: {
                    title: null,
                    status: null,
                    allyId: null,
                    startDate: null,
                    endDate: null,
                    dateRange: []
                },
                form: {
                    title: "新增版本",
                    show: false,
                    version: {
                        allyId: null,
                        title: null,
                        pushVersion: null,
                        desc: null,
                        apkUrl: null
                    },
                    ruleValidate: {
                        title: [
                            {required: true, message: '版本标题不能为空', trigger: 'blur'}
                        ],
                        pushVersion: [
                            {required: true, message: '版本号不能为空', trigger: 'blur'}
                        ],
                        desc: [
                            {required: true, message: '版本简介不能为空', trigger: 'blur'}
                        ]
                    },
                    isAdd: true,
                },
                content: {
                    loading: false,
                    total: 0,
                    columns: [
                        {
                            title: 'ID',
                            key: 'id',
                            width: 80,
                        },
                        {
                            title: '创建时间',
                            key: 'createDate',
                            width: 150,
                            render: (h, params) => {
                                let createTime = new Date(params.row.createTime);
                                return h('span', {}, createTime.format("yyyy-MM-dd hh:mm:ss"));
                            }
                        },
                        {
                            title: '所属盟友',
                            key: 'allyName',
                            width: 150,
                            render: (h, params) => {
                                let allyName = "";
                                this.option.allys.forEach(e => {
                                    if (e.id == params.row.allyId) {
                                        allyName = e.name;
                                    }
                                });
                                return h('span', {}, allyName);
                            }
                        },
                        {
                            title: '标题',
                            key: 'title',
                            width: 150,
                        },
                        {
                            title: '版本号',
                            key: 'pushVersion',
                            width: 150,
                        },
                        {
                            title: '大小',
                            key: 'apkSize',
                            width: 150,
                            render: (h, params) => {
                                let size = params.row.apkSize / 1024 / 1024;
                                size = accounting.format(size, 4);
                                return h('span', {}, size + " MB");
                            }
                        },
                        {
                            title: '状态',
                            key: 'status',
                            width: 150,
                            render: (h, params) => {
                                if (params.row.status == -1) {
                                    return h('span', {}, '已经下架');
                                } else if (params.row.status == 0) {
                                    return h('span', {}, '未上架');
                                } else if (params.row.status == 1) {
                                    return h('span', {}, '已上架');
                                }
                            }
                        },
                        {
                            title: '备注',
                            key: 'remark',
                            width: 150,
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 400,
                            fixed: 'right',
                            align: 'center',
                            render: (h, params) => {
                                let upDownTitle = "上架";
                                if (params.row.status == 1) {
                                    upDownTitle = "下架";
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
                                                this.handleShow(params.row)
                                            }
                                        }
                                    }, '查看详情'),
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handlePushVersion(params.row)
                                            }
                                        }
                                    }, '推送版本'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleEdit(params.row)
                                            }
                                        }
                                    }, '编辑修改'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleSoldOut(params.row)
                                            }
                                        }
                                    }, upDownTitle),
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleRemove(params.row)
                                            }
                                        }
                                    }, '删除'),
                                    h('Button', {
                                        props: {
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleDownload(params.row)
                                            }
                                        }
                                    }, '下载'),
                                ])
                            }
                        }
                    ],
                    data: []
                },
                view: {
                    show: false,
                    version: {}
                },
                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                }
            }
        },
        created() {
            this.queryAllyInfo();
            this.search.allyId = this.$route.query.allyId;
            this.queryVersion();
        },
        methods: {
            handleShow(row) {
                this.view.show = true;
                this.view.version = row;
            },
            handlePushVersion(row) {

            },
            handleEdit(row) {
                this.form.isAdd = false;
                this.form.title = '更新版本';
                this.form.version = row;
                this.form.show = true;
            },
            handleSoldOut(row) {
                let message = "";
                console.info(row.status);
                if (row.status == -1 || row.status == 0) {
                    message = "上架成功";
                } else {
                    message = "下架成功";
                }
                this.versionUpDown(row.id);
                this.$Message.success(message);
            },
            handleRemove(row) {
                this.deleteVersion(row.id);
            },
            handleDownload(row) {
                let downUrl = this.baseRequestUrl + "/system/upload/download?fileSrc=" + row.apkUrl;
                window.open(downUrl, '_blank');
            },
            handleSearch() {
                if (this.search.dateRange && this.search.dateRange.length == 2) {
                    this.search['startDate'] = this.search.dateRange[0];
                    this.search['endDate'] = this.search.dateRange[1];
                }
                this.queryVersion()
            },
            handleCreate() {
                this.form.show = true;
                this.form.version = {};
                this.form.isAdd = true;
                this.form.title = "新增版本";
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (!self.form.version.allyId) {
                        this.$Message.error('验证不通过, 请选择盟友!');
                        return;
                    }
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createVersion()
                        } else {
                            this.updateVersion()
                        }
                        this.form.show = false;
                        setTimeout(this.queryVersion, 1000)
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            handleChangeFileSrc(fileSrc) {
                this.form.version.apkUrl = fileSrc;
            },
            async createVersion() {
                try {
                    let res = await post('/api/mgm/versioninfo/add', this.form.version);
                    if (res.status === 1) {
                        this.$Message.success('新增成功');
                        this.queryVersion();
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async updateVersion() {
                try {
                    let res = await post('/api/mgm/versioninfo/update/' + this.form.version.id, this.form.version);
                    if (res.status === 1) {
                        this.$Message.success('更新成功');
                        this.queryVersion();
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async queryVersion() {
                try {
                    let res = await post('/api/mgm/versioninfo/list', this.search);
                    this.content.data = res.data.records;
                } catch (error) {
                    this.$throw(error);
                }
            },
            async queryAllyInfo() {
                try {
                    let res = await post('/api/mgm/ally/list', this.search);
                    this.option.allys = res.data.records;
                } catch (error) {
                    this.$throw(error)
                }
            },
            async versionUpDown(id) {
                try {
                    let res = await get("/api/mgm/versioninfo/upDown?id=" + id);
                    this.queryVersion();
                } catch (error) {
                    this.$throw(error);
                }
            },
            async deleteVersion(id) {
                try {
                    let res = await post("/api/mgm/versioninfo/remove/" + id);
                    this.queryVersion();
                } catch (error) {
                    this.$throw(error);
                }
            }
        }
    }
</script>

<style scoped>

</style>
