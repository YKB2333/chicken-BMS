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
            <div class="brand-list">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
            </div>
        </Card>

        <!-- 新增修改 -->
        <Drawer
                :title="form.title"
                v-model="form.show"
                width="720"
                :mask-closable="false"
                :styles="styles">
            <Form :model="form.brand" ref="formBrand" :rules="form.ruleValidate" style="margin-right: 30px">
                <FormItem label="品牌名称: " label-position="left" :label-width="80" prop="name">
                    <Input v-model="form.brand.name" placeholder="请输入品牌名称" style="width: 300px"/>
                </FormItem>
                <FormItem label="背景图片: " label-position="left" :label-width="80" prop="backgroud">
                    <UploadImg :src="form.brand.backgroud" @changeSrc="handleChangeBgPic"/>
                </FormItem>
                <FormItem label="品牌Logo: " label-position="left" :label-width="80" prop="logo">
                    <UploadImg :src="form.brand.logo" @changeSrc="handleChangeLogoPic"/>
                </FormItem>
                <FormItem label="品牌描述: " label-position="left" :label-width="80" prop="describe">
                    <Input v-model="form.brand.describe" type="textarea" :autosize="{minRows: 4,maxRows: 10}"/>
                </FormItem>
                <FormItem label="设备信息: " label-position="left" :label-width="80" prop="deviceInfo">
                    <Input v-model="form.brand.deviceInfo" type="textarea" :autosize="{minRows: 4,maxRows: 10}"/>
                </FormItem>
                <FormItem label="联系信息: " label-position="left" :label-width="80" prop="contactInfo">
                    <Input v-model="form.brand.contactInfo" type="textarea" :autosize="{minRows: 4,maxRows: 10}"/>
                </FormItem>
                <FormItem label="开机图片: " label-position="left" :label-width="80" prop="image">
                    <UploadImg :src="form.brand.image" @changeSrc="handleChangeStartUpPic"/>
                </FormItem>
                <FormItem :label-width="80">
                    <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formBrand')">提交</Button>
                    <Button style="margin-left: 8px" @click="handleReset('formBrand')">重置</Button>
                </FormItem>
            </Form>
        </Drawer>

    </div>
</template>

<script>
    import {post} from "../../libs/axios-cfg";
    import UploadImg from "../main/components/upload-img/upload-img";
    import config from '../../config/index'

    export default {
        components: {UploadImg},
        data: function () {
            const baseRequestUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
            return {
                allyKey: null,
                content: {
                    loading: false,
                    data: [],
                    columns: [
                        {
                            title: '品牌名称',
                            key: 'name'
                        },
                        {
                            title: '盟友key',
                            key: 'allyKey'
                        },
                        {
                            title: '开机图片',
                            key: 'image',
                            render: (h, params) => {
                                return h('img', {
                                    attrs: {
                                        src: baseRequestUrl + "/filesys/" + params.row.image,
                                    },
                                    style: {
                                        width: '120px',
                                        height: '80px'
                                    }
                                }, '测试')
                            }
                        },
                        {
                            title: '品牌图片',
                            key: 'logo',
                            render: (h, params) => {
                                return h('img', {
                                    attrs: {
                                        src: baseRequestUrl + "/filesys/" + params.row.logo,
                                    },
                                    style: {
                                        width: '120px',
                                        height: '80px'
                                    }
                                }, '测试')
                            }
                        },
                        {
                            title: '更新时间',
                            key: 'updateTime',
                            render: (h, params) => {
                                return h('span', {}, new Date(params.row.updateTime).toLocaleDateString())
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
                                            this.handleEdit(params.row)
                                        }
                                    }
                                }, '修改')
                            }
                        }
                    ]
                },
                form: {
                    title: "新增品牌",
                    show: false,
                    isAdd: true,
                    brand: {
                        allyKey: null,
                        image: "",
                        logo: "",
                        backgroud: "",
                        name: null,
                        describe: null,
                        deviceInfo: null,
                        contactInfo: null
                    },
                    ruleValidate: {
                        name: [
                            {required: true, message: '品牌名称不能为空', trigger: 'blur'}
                        ],
                        describe: [
                            {required: true, message: '品牌描述不能为空', trigger: 'blur'}
                        ],
                        backgroud: [
                            {required: true, message: '背景图片不能为空', trigger: 'blur'}
                        ],
                        logo: [
                            {required: true, message: '品牌logo不能为空', trigger: 'blur'}
                        ],
                        image: [
                            {required: true, message: '开机图片不能为空', trigger: 'blur'}
                        ],
                        deviceInfo: [
                            {required: true, message: '设备信息不能为空', trigger: 'blur'}
                        ],
                        contactInfo: [
                            {required: true, message: '联系信息不能为空', trigger: 'blur'}
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
            this.allyKey = this.$route.query.allyKey;
            this.form.brand.allyKey = this.allyKey;
            this.queryBarnd()
        },
        methods: {
            handleChangeBgPic(value) {
                this.form.brand.backgroud = value;
            },
            handleChangeLogoPic(value) {
                this.form.brand.logo = value;
            },
            handleChangeStartUpPic(value) {
                this.form.brand.image = value;
            },
            handleCreate() {
                var self = this;
                this.form.show = true;
                this.form.brand = {
                    allyKey: self.allyKey
                };
            },
            handleRefre() {
                this.queryBarnd();
            },
            handleEdit(row) {
                console.info(row);
                this.form.isAdd = false;
                this.form.title = '更新品牌';
                this.form.brand = row;
                this.form.show = true;
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createBrand()
                        } else {
                            this.updateBrand()
                        }
                        this.form.show = false;
                        setTimeout(this.queryBarnd, 1000);
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            async createBrand() {
                try {
                    let res = await post('/api/mgm/brandinfo/add', this.form.brand)
                    if (res.status === 1) {
                        this.$Message.success('新增成功');
                        this.queryBarnd()
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async updateBrand() {
                try {
                    let res = await post('/api/mgm/brandinfo/update/' + this.form.brand.id, this.form.brand)
                    if (res.status === 1) {
                        this.$Message.success('更新成功');
                        this.queryBarnd()
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async queryBarnd() {
                this.content.loading = true;
                try {
                    let res = await post('api/mgm/brandinfo/list', {allyKey: this.allyKey});
                    this.content.data = res.data.records
                } catch (error) {
                    this.$throw(error)
                }
                this.content.loading = false
            }
        }
    }
</script>

<style scoped>

</style>
