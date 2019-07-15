<template>
    <div>
        <Card>
            <div class="ally-search margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>盟友ID: </label>
                        <Input v-model="search.key" placeholder="盟友ID" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>盟友名称: </label>
                        <Input v-model="search.allyName" placeholder="盟友名称" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>模板名称: </label>
                        <Input v-model="search.templateName" placeholder="模板名称" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
                    </Col>
                </Row>
            </div>
            <div class="ally-list">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
            </div>

            <!-- 新增修改 -->
            <Drawer
                    :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false"
                    :styles="styles">
                <Form :model="form.ally" ref="formAlly" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="盟友ID: " label-position="left" :label-width="80" prop="key">
                        <Input v-model="form.ally.key" placeholder="请输入盟友ID" style="width: 300px"
                               :disabled="!form.isAdd"/>
                    </FormItem>
                    <FormItem label="盟友名称: " label-position="left" :label-width="80" prop="name">
                        <Input v-model="form.ally.name" placeholder="请输入盟友名称" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="手机号: " label-position="left" :label-width="80" prop="mobile">
                        <Input v-model="form.ally.mobile" placeholder="请输入手机号" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="微信号: " label-position="left" :label-width="80" prop="wechat">
                        <Input v-model="form.ally.wechat" placeholder="请输入微信号" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="QQ号: " label-position="left" :label-width="80" prop="qq">
                        <Input v-model="form.ally.qq" placeholder="请输入QQ号" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="邮箱: " label-position="left" :label-width="80" prop="email">
                        <Input v-model="form.ally.email" placeholder="请输入邮箱" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="模板: " label-position="left" :label-width="80" prop="templateId">
                        <Select v-model="form.ally.templateId" placeholder="请选择模板" style="width: 300px">
                            <Option v-for="template in option.templates" :value="template.id" :key="template.name">{{
                                template.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="城市: " label-position="left" :label-width="80" prop="city">
                        <ProvinceCity :province-id=null :city-id="form.ally.city" @changeCity="handleChangeCity"/>
                    </FormItem>
                    <FormItem label="详细地址: " label-position="left" :label-width="80" prop="address">
                        <Input v-model="form.ally.address" placeholder="请输入详细地址"/>
                    </FormItem>
                    <FormItem label="备注: " label-position="left" :label-width="80" prop="remark">
                        <Input v-model="form.ally.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formAlly')">提交</Button>
                        <Button style="margin-left: 8px" @click="handleReset('formAlly')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

            <!-- 展示信息 -->
            <Modal
                    v-model="view.show"
                    title="盟友详细信息">
                <p>ID: &nbsp;&nbsp;{{view.ally.id}}</p>
                <p>盟友KEY: &nbsp;&nbsp;{{view.ally.key}}</p>
                <p>盟友名称: &nbsp;&nbsp;{{view.ally.name}}</p>
                <p>手机号: &nbsp;&nbsp;{{view.ally.mobile}}</p>
                <p>微信号: &nbsp;&nbsp;{{view.ally.wechat}}</p>
                <p>QQ号: &nbsp;&nbsp;{{view.ally.qq}}</p>
                <p>邮箱: &nbsp;&nbsp;{{view.ally.email}}</p>
                <p>所在城市: &nbsp;&nbsp;{{view.ally.templateName}}</p>
                <p>详细地址: &nbsp;&nbsp;{{view.ally.address}}</p>
                <p>模板: &nbsp;&nbsp;{{view.ally.templateName}}</p>
                <p>备注: &nbsp;&nbsp;{{view.ally.remark}}</p>
            </Modal>

        </Card>
    </div>
</template>

<script>
    import {get, post} from '../../libs/axios-cfg'
    import ProvinceCity from '../main/components/province-city/province-city'

    export default {

        components: {ProvinceCity},
        data() {
            var self = this
            const validateKey = async (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('盟友ID不能为空'))
                }
                if (!self.form.isAdd) {
                    return
                }
                try {
                    let res = await get('/api/mgm/ally/one?key=' + value)
                    if (res.data != null) {
                        callback(new Error('盟友ID重复'))
                    }
                } catch (error) {
                    callback(error)
                }
            };
            const validateMobile = async (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'))
                }
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
                if (!myreg.test(value)) {
                    return callback(new Error('手机号格式错误'))
                }
            };
            return {
                option: {
                    templates: []
                },
                search: {
                    key: null,
                    allyName: null,
                    templateName: null
                },
                content: {
                    loading: false,
                    columns: [
                        {
                            title: 'ID',
                            key: 'id'
                        },
                        {
                            title: '盟友KEY',
                            key: 'key'
                        },
                        {
                            title: '盟友名称',
                            key: 'name'
                        },
                        {
                            title: '所在城市',
                            key: 'cityName'
                        },
                        {
                            title: '模板',
                            key: 'templateName'
                        },
                        {
                            title: '备注',
                            key: 'remark'
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 350,
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
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleShowBrand(params.row)
                                            }
                                        }
                                    }, '品牌管理'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleVersionMgm(params.row)
                                            }
                                        }
                                    }, '版本管理')
                                ])
                            }
                        }
                    ],
                    data: []
                },
                view: {
                    show: false,
                    ally: {}
                },
                form: {
                    title: '新增盟友',
                    isAdd: true,
                    show: false,
                    ally: {
                        id: null,
                        key: null,
                        name: null,
                        mobile: null,
                        wechat: null,
                        qq: null,
                        email: null,
                        templateId: null,
                        city: null,
                        address: null,
                        remark: null
                    },
                    ruleValidate: {
                        key: [
                            {validator: validateKey, required: true, trigger: 'blur'}
                        ],
                        name: [
                            {required: true, message: '盟友名称不能为空', trigger: 'blur'}
                        ],
                        mobile: [
                            {validator: validateMobile, required: true, trigger: 'blur'}
                        ],
                        email: [
                            {type: 'email', message: '邮箱格式错误', trigger: 'blur'}
                        ]
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
            this.queryAllyInfo()
            this.queryTemplateInfo()
        },
        methods: {
            handleChangeCity(value) {
                this.form.ally.city = value;
            },
            handleShow(row) {
                this.view.show = true;
                this.view.ally = row;
            },
            handleShowClose() {
                this.view.show = false;
            },
            handleShowBrand(row) {
                this.$router.push({path: '/ally/brand/list?allyKey=' + row.key});
            },
            handleVersionMgm(row) {
                this.$router.push({path: '/version/list?allyId=' + row.id});
            },
            handleEdit(row) {
                this.form.isAdd = false;
                this.form.title = '更新盟友';
                this.form.ally = row;
                this.form.show = true;
            },
            handleSearch() {
                this.queryAllyInfo()
            },
            handleCreate() {
                this.form.show = true;
                this.form.ally = {};
                this.form.isAdd = true
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createAllyInfo()
                        } else {
                            this.updateAllyInfo()
                        }
                        this.form.show = false
                        this.queryAllyInfo()
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            async queryAllyInfo() {
                this.content.loading = true
                try {
                    let res = await post('/api/mgm/ally/list', this.search)
                    this.content.data = res.data.records
                } catch (error) {
                    this.$throw(error)
                }
                this.content.loading = false
            },
            async createAllyInfo() {
                try {
                    let res = await post('/api/mgm/ally/add', this.form.ally)
                    if (res.status === 1) {
                        this.$Message.success('新增成功')
                        this.queryAllyInfo();
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async updateAllyInfo() {
                try {
                    let res = await post('/api/mgm/ally/update/' + this.form.ally.id, this.form.ally)
                    if (res.status === 1) {
                        this.$Message.success('更新成功')
                        this.queryAllyInfo();
                    }
                } catch (error) {
                    this.$throw(error)
                }
            },
            async queryTemplateInfo() {
                try {
                    let res = await post('/api/mgm/templateinfo/list', this.search);
                    this.option.templates = res.data.records;
                } catch (error) {
                    this.$throw(error);
                }
            }
        }
    }
</script>

<style scoped>

</style>
