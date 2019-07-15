<template>
    <div>
        <Card>
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
                        <Button type="success" icon="ios-loading" @click="handleRefre">刷新</Button>
                    </Col>
                </Row>
            </div>
            <div class="classify-list">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
            </div>

            <!-- 新增修改 -->
            <Drawer
                    :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false"
                    :styles="styles">
                <Form :model="form.classify" ref="formClassify" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="类型: " label-position="left" :label-width="80" prop="name">
                        <Input v-model="form.classify.name" placeholder="请输入类别名" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="位置: " label-position="left" :label-width="80" prop="location">
                        <Select v-model="form.classify.location" placeholder="请选择位置" style="width: 220px" clearable>
                            <Option value="BGI_IMG_APP" key="BGI_IMG_APP">大图应用</Option>
                            <Option value="MEDIUM_IMG_APP" key="MEDIUM_IMG_APP">中图应用</Option>
                            <Option value="SMALL_IMG_APP" key="SMALL_IMG_APP">小图应用</Option>
                            <Option value="RECO_IMG_APP" key="RECO_IMG_APP">推荐应用</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="位置: " label-position="left" :label-width="80" prop="location">
                        <UploadImg :src="form.classify.icon" @changeSrc="handleChangeIcon"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formClassify')">提交
                        </Button>
                        <Button style="margin-left: 8px" @click="handleReset('formClassify')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>
        </Card>
    </div>
</template>

<script>
    import UploadImg from "../main/components/upload-img/upload-img";
    import {post} from "../../libs/axios-cfg";
    import config from '../../config/index';

    export default {
        components: {UploadImg},
        data() {
            return {
                baseRequestUrl: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro,
                search: {},
                content: {
                    loading: false,
                    columns:
                        [
                            {
                                title: 'ID',
                                key: 'id',
                                width: 80,
                            },
                            {
                                title: '类别名',
                                key: 'name',
                                width: 220,
                            },
                            {
                                title: '位置',
                                key: 'location',
                                width: 220,
                                render: (h, params) => {
                                    var showLocation = '';
                                    switch (params.row.location) {
                                        case 'BGI_IMG_APP':
                                            showLocation = '大图应用';
                                            break;
                                        case 'MEDIUM_IMG_APP':
                                            showLocation = '中图应用';
                                            break;
                                        case 'SMALL_IMG_APP':
                                            showLocation = '小图应用';
                                            break;
                                        case 'RECO_IMG_APP':
                                            showLocation = '推荐应用';
                                            break;
                                        default:
                                            break
                                    }
                                    return h('span', {}, showLocation);
                                }
                            },
                            {
                                title: '图标',
                                key: 'icon',
                                render: (h, params) => {
                                    return h('img', {
                                        attrs: {
                                            src: this.baseRequestUrl + "/filesys/" + params.row.icon,
                                        },
                                        style: {
                                            width: '120px',
                                            height: '80px'
                                        }
                                    }, '类别icon');
                                }
                            },
                            {
                                title: '创建时间',
                                key: 'createTime',
                                width: 200,
                                render: (h, params) => {
                                    let createTime = new Date(params.row.createTime);
                                    return h('span', {}, createTime.format('yyyy-MM-dd hh:mm:ss'));
                                }
                            },
                            {
                                title: '操作',
                                key: 'action',
                                width: 100,
                                align: 'center',
                                render: (h, params) => {
                                    return h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleEdit(params.row);
                                            }
                                        }
                                    }, '编辑')
                                }
                            }
                        ],
                    data: []
                },
                form: {
                    title: "新增应用类别",
                    isAdd: true,
                    show: false,
                    classify: {
                        name: null,
                        location: null,
                        icon: null
                    },
                    ruleValidate: {
                        name: [
                            {required: true, message: '请输入类别名称', trigger: 'blur'}
                        ],
                        location: [
                            {required: true, message: '请输入类别名称', trigger: 'blur'}
                        ],
                    }
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
            this.queryClassifyInfo();
        },
        methods: {
            handleCreate() {
                this.form.show = true;
                this.form.title = "新增应用类别";
                this.form.isAdd = true;
            },
            handleEdit(row) {
                this.form.show = true;
                this.form.title = "更新应用类别";
                this.form.isAdd = false;
                this.form.classify = row;
            },
            handleRefre() {
                this.queryClassifyInfo();
            },
            handleChangeIcon(icon) {
                this.form.classify.icon = icon;
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createClassifyInfo();
                        } else {
                            this.updateClassfiyInfo();
                        }
                        this.form.show = false;
                        this.queryClassifyInfo();
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            async createClassifyInfo() {
                try {
                    let res = await post("/api/mgm/classify/add", this.form.classify);
                    if (res.status == 1) {
                        this.$Message.success("新增成功");
                    } else {
                        this.$Message.error("新增失败");
                    }
                    this.queryClassifyInfo();
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateClassfiyInfo() {
                try {
                    let res = await post("/api/mgm/classify/update/" + this.form.classify.id, this.form.classify);
                    if (res.status == 1) {
                        this.$Message.success("更新成功");
                    } else {
                        this.$Message.error("更新失败");
                    }
                    this.queryClassifyInfo();
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryClassifyInfo() {
                this.content.loading = true;
                try {
                    let res = await post('/api/mgm/classify/list', this.search);
                    if (res.status == 1) {
                        this.content.data = res.data.records;
                    } else {
                        this.$Message.error("数据加载失败");
                    }
                } catch (error) {
                    this.$throw(error)
                }
                this.content.loading = false;
            }
        }
    }
</script>

<style scoped>

</style>
