<template>
    <div class="app">
        <Card>
            <!-- 数据搜索 -->
            <div class="app-search margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>应用名称: </label>
                        <Input v-model="search.name" placeholder="应用名称" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>盟友名称: </label>
                        <Input v-model="search.allyName" placeholder="盟友名称" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>创建时间: </label>
                        <DatePicker :value="search.dateRange" format="yyyy-MM-dd" type="daterange" placeholder="创建时间范围"
                                    style="width: 200px"/>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="6">
                        <label>状态: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <Input v-model="search.status" placeholder="状态" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>位置: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <Input v-model="search.location" placeholder="位置" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
                    </Col>
                </Row>
            </div>

            <!-- 数据列表 -->
            <div class="app-list">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
            </div>

            <!-- 新增修改 -->
            <Drawer
                    :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false"
                    :styles="styles" style="">
                <Form :model="form.app" ref="formApp" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="应用名称: " label-position="left" :label-width="80" prop="appName">
                        <Input v-model="form.app.appName" placeholder="请输入应用名称" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="应用版本: " label-position="left" :label-width="80" prop="version">
                        <Input v-model="form.app.version" placeholder="请输入应用版本" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="应用包名: " label-position="left" :label-width="80" prop="appPkgName">
                        <Input v-model="form.app.appPkgName" placeholder="请输入应用包名" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="上传应用: " label-position="left" :label-width="80" prop="appUrl">
                        <UploadDownload :src="form.app.appUrl" action='/system/upload/file/apk'
                                        @changeFileSrc="handleChangeFileSrc"/>
                    </FormItem>
                    <FormItem label="备用下载: " label-position="left" :label-width="80" prop="bakDownloadUrl">
                        <Input v-model="form.app.bakDownloadUrl" placeholder="请输入备用下载地址" style="width: 500px"/>
                    </FormItem>
                    <FormItem label="应用图标: " label-position="left" :label-width="80" prop="templateId">
                        <Select v-model="form.app.templateId" placeholder="请选择模板" style="width: 220px" clearable>
                            <Option v-for="template in option.templates" :value="template.id" :key="template.name">
                                {{template.name}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="位置: " label-position="left" :label-width="80" prop="location">
                        <Select v-model="form.app.location" placeholder="请选择位置" style="width: 220px" clearable>
                            <Option value="BGI_IMG_APP" key="BGI_IMG_APP">大图应用</Option>
                            <Option value="MEDIUM_IMG_APP" key="MEDIUM_IMG_APP">中图应用</Option>
                            <Option value="SMALL_IMG_APP" key="SMALL_IMG_APP">小图应用</Option>
                            <Option value="RECO_IMG_APP" key="RECO_IMG_APP">推荐应用</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="所属类别: " label-position="left" :label-width="80" prop="classifyId">
                        <Select v-model="form.app.classifyId" placeholder="请选择应用分类" style="width: 220px" clearable>
                            <Option v-for="classify in option.classifys" :value="classify.id" :key="classify.id">
                                {{classify.name}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="排位: " label-position="left" :label-width="80" prop="rank">
                        <Input v-model="form.app.rank" placeholder="请输入排位" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="所属盟友: " label-position="left" :label-width="80" prop="allyId">
                        <Select v-model="form.app.allyId" placeholder="请选择所属盟友" style="width: 300px" clearable>
                            <Option v-for="ally in option.allys" :value="ally.id" :key="ally.id">{{ally.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注: " label-position="left" :label-width="80" prop="remark">
                        <Input v-model="form.app.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}"
                               placeholder="请输入备注"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formApp')">提交</Button>
                        <Button style="margin-left: 8px" @click="handleReset('formApp')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

            <!-- 展示信息 -->
            <Modal v-model="view.show"
                   title="盟友详细信息">
                <p>ID: &nbsp;&nbsp;{{view.app.id}}</p>
                <p>应用类型 : &nbsp;&nbsp;{{view.app.location}}</p>
                <p>应用名称: &nbsp;&nbsp;{{view.app.appName}}</p>
                <p>版本号: &nbsp;&nbsp;{{view.app.version}}</p>
                <p>应用包名: &nbsp;&nbsp;{{view.app.appPkgName}}</p>
                <p>下载地址: &nbsp;&nbsp;{{view.app.appUrl}}</p>
                <p>备用下载地址: &nbsp;&nbsp;{{view.app.bakDownloadUrl}}</p>
                <p>创建时间: &nbsp;&nbsp;{{view.app.createTime}}</p>
                <p>图标: &nbsp;&nbsp;{{view.app.templateId}}</p>
                <p>排位: &nbsp;&nbsp;{{view.app.rank}}</p>
                <p>归属类型: &nbsp;&nbsp;特定盟友</p>
                <p>归属盟友: &nbsp;&nbsp;{{view.app.allyId}}</p>
                <p>备注: &nbsp;&nbsp;{{view.app.remark}}</p>
            </Modal>

        </Card>
    </div>
</template>

<script>
    import {get, post} from '../../libs/axios-cfg';
    import UploadDownload from "../main/components/upload-download/upload-download";
    import config from "../../config/index";

    export default {
        components: {UploadDownload},
        data() {
            const baseRequestUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
            return {
                baseRequestUrl: baseRequestUrl,
                option: {
                    templates: [],
                    allys: [],
                    classifys: []
                },
                search: {
                    name: null,
                    appName: null,
                    dateRange: [],
                    status: null,
                },
                view: {
                    show: false,
                    app: {}
                },
                form: {
                    title: "新增应用",
                    isAdd: false,
                    show: false,
                    app: {
                        appName: null,
                        version: null,
                        appPkgName: null,
                        appUrl: null,
                        bakDownloadUrl: null,
                        templateId: null,
                        location: null,
                        allyId: null,
                        remark: null,
                        classifyId: null
                    },
                    ruleValidate: {
                        appName: [
                            {required: true, message: '应用名称不能为空', trigger: 'blur'}
                        ],
                        version: [
                            {required: true, message: '应用版本不能为空', trigger: 'blur'}
                        ],
                        appPkgName: [
                            {required: true, message: '应用包名不能为空', trigger: 'blur'}
                        ],
                        appUrl: [
                            {required: true, message: '请上传APP文件', trigger: 'blur'}
                        ],
                        rank: [
                            {required: true, message: '排位不能为空', trigger: 'blur'}
                        ]
                    }
                },
                content: {
                    total: 0,
                    loading: false,
                    columns: [
                        {
                            title: '所属盟友',
                            key: 'allyName',
                            width: 100,
                        },
                        {
                            title: '适用模板',
                            key: 'templateName',
                            width: 120,
                        },
                        {
                            title: '创建时间',
                            key: 'createTime',
                            width: 140,
                        },
                        {
                            title: '应用名称',
                            key: 'appName',
                            width: 140,
                        },
                        {
                            title: '状态',
                            key: 'status',
                            width: 90,
                        },
                        {
                            title: '位置',
                            key: 'location',
                            width: 90,
                        },
                        {
                            title: '排位',
                            key: 'rank',
                            width: 80,
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 350,
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
                                    }, '下载')
                                ])
                            }
                        }
                    ],
                    data: []
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
            this.queryApp();
            this.queryTemplateInfo();
            this.queryAllyInfo();
            this.queryClassifyInfo();
        },
        methods: {
            handleShow(row) {
                this.view.show = true;
                this.view.app = row;
            },
            handleEdit(row) {
                this.form.isAdd = false;
                this.form.title = '更新应用';
                this.form.app = row;
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
                this.appUpDown(row.id);
                this.$Message.success(message);
            },
            handleRemove(row) {
                this.deleteApp(row.id);
            },
            handleDownload(row) {
                let downUrl = this.baseRequestUrl + "/system/upload/download?fileSrc=" + row.appUrl;
                window.open(downUrl, '_blank');
            },
            handleSearch() {
                this.queryApp();
            },
            handleCreate() {
                this.form.show = true;
                this.form.app = {};
                this.form.isAdd = true;
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (!this.form.app.templateId) {
                        this.$Message.error('验证不通过, 请选择应用模板!');
                        return;
                    }
                    if (!this.form.app.allyId) {
                        this.$Message.error('验证不通过, 请选择盟友!');
                        return;
                    }
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createApp()
                        } else {
                            this.updateApp()
                        }
                        this.form.show = false;
                        this.queryVersion();
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            handleChangeFileSrc(value) {
                this.form.app.appUrl = value;
            },
            async createApp() {
                try {
                    let res = await post('/api/mgm/app/add', this.form.app);
                    if (res.status === 1) {
                        this.$Message.success('新增成功');
                        this.queryApp();
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async updateApp() {
                try {
                    let res = await post('/api/mgm/app/update/' + this.form.app.id, this.form.app);
                    if (res.status === 1) {
                        this.$Message.success('更新成功');
                        this.queryAllyInfo();
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async queryApp() {
                try {
                    let res = await post('/api/mgm/app/list', this.search);
                    this.content.data = res.data.records;
                } catch (error) {
                    this.$throw(error);
                }
            },

            async queryTemplateInfo() {
                try {
                    let res = await post('/api/mgm/templateinfo/list', this.search);
                    this.option.templates = res.data.records;
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
            async appUpDown(id) {
                try {
                    let res = await get('/api/mgm/app/upDown?id=' + id);
                    this.queryApp();
                } catch (error) {
                    this.$throw(error)
                }
            },
            async deleteApp(id) {
                try {
                    let res = await post("/api/mgm/app/remove/" + id);
                    this.queryApp();
                } catch (error) {
                    this.$throw(error);
                }
            },
            async queryClassifyInfo() {
                try {
                    let res = await post('/api/mgm/classify/list', {});
                    if (res.status == 1) {
                        this.option.classifys = res.data.records;
                    } else {
                        this.$Message.error("数据加载失败");
                    }
                } catch (error) {
                    this.$throw(error)
                }
            }
        }
    }
</script>

<style scoped>
    .app {

    }
</style>
