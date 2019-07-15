<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>状态: &nbsp;&nbsp;</label>
                        <Select v-model="search.status" placeholder="请选择状态" style="width: 180px" clearable>
                            <Option v-for="status in options.status" :value="status.value" :key="status.value">
                                {{status.label }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <label>配置分类: &nbsp;&nbsp;</label>
                        <Select v-model="search.configCls" placeholder="请选择配置分类" style="width: 180px" clearable>
                            <Option v-for="status in options.configCls" :value="status.value" :key="status.value">
                                {{status.label }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <label>配置参数: &nbsp;&nbsp;</label>
                        <Input v-model="search.variable" placeholder="请输入配置参数" style="width: 180px"/>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
                    </Col>
                </Row>
            </div>

            <!-- 数据展示 -->
            <div style="overflow: hidden">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.records"></Table>
                <div class="margin-top-8"></div>
                <Page :total="content.total" @on-change="handleChangePage" @on-page-size-change="handleChangePageSize"
                      show-sizer show-total show-elevator class="margin-right-10"
                      style="display: inline-flex;float: right;"/>
            </div>

            <!-- 新增修改 -->
            <Drawer class="add-update-drawer" :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false">
                <Form :model="form.config" ref="formConfig" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="配置参数: " label-position="left" :label-width="80" prop="variable">
                        <Input v-model="form.config.variable" style="width: 300px" :disabled="!form.isAdd"/>
                    </FormItem>
                    <FormItem label="配置值: " label-position="left" :label-width="80" prop="value">
                        <Input v-model="form.config.value" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
                    </FormItem>
                    <FormItem label="扩展配置值: " label-position="left" :label-width="80" prop="extendValue">
                        <Input v-model="form.config.extendValue" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
                    </FormItem>
                    <FormItem label="配置分类: " label-position="left" :label-width="80" prop="configCls">
                        <Select v-model="form.config.configCls" placeholder="请选择配置分类" style="width: 180px" clearable>
                            <Option v-for="status in options.configCls" :value="status.value" :key="status.value">
                                {{status.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="状态: " label-position="left" :label-width="80" prop="status">
                        <Select v-model="form.config.status" placeholder="请输入状态" style="width: 180px" clearable>
                            <Option v-for="status in options.status" :value="status.value" :key="status.value">
                                {{status.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注: " label-position="left" :label-width="80" prop="remark">
                        <Input v-model="form.config.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formConfig')">提交</Button>
                        <Button style="margin-left: 8px" @click="handleReset('formConfig')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

        </Card>
    </div>
</template>

<script>
    import {post} from "../../../libs/axios-cfg";

    export default {
        name: "index",
        data() {
            return {
                options: {
                    status: [
                        {value: "Y", label: "生效"},
                        {value: "N", label: "失效"}
                    ],
                    configCls: [
                        {value: "CONSTANTS", label: "系统常量配置"},
                        {value: "MILLET_COMMON", label: "小米充值配置普通"},
                        {value: "MILLET_PRIMARY", label: "小米充值配置会员"},
                        {value: "MILLET_SENIOR", label: "小米充值配置高级"},
                        {value: "MILLET_SUPERSTAR", label: "小米充值配置超级"},
                        {value: "COUNTRY_LIST", label: "国家配置"}
                    ]
                },
                search: {
                    status: null,
                    configCls: null,
                    variable: null,
                    page: 1,
                    pageSize: 10
                },
                content: {
                    loading: false,
                    total: 0,
                    records: [],
                    columns: [
                        {
                            title: '配置ID',
                            key: 'id',
                            width: 100
                        },
                        {
                            title: '配置参数',
                            key: 'variable',
                            width: 250
                        },
                        {
                            title: '配置值',
                            key: 'value',
                            width: 500
                        },
                        {
                            title: '配置分类',
                            key: 'configCls',
                            width: 150,
                            render: (h, params) => {
                                return h('span', {}, params.row.configCls && params.row.configCls.name);
                            }
                        },
                        {
                            title: '扩展值',
                            key: 'extendValue',
                            width: 200
                        },
                        {
                            title: '是否生效',
                            key: 'status',
                            width: 100,
                            render: (h, params) => {
                                return h('span', {}, params.row.status && params.row.status.name);
                            }
                        },
                        {
                            title: '备注',
                            key: 'remark',
                            width: 200
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
                                                this.handleEdit(params.row)
                                            }
                                        }
                                    }, '编辑')
                                ])
                            }
                        }
                    ]
                },
                form: {
                    title: "新增配置项",
                    isAdd: true,
                    show: false,
                    config: {},
                    ruleValidate: {
                        variable: [
                            {required: true, message: '配置参数不能为空', trigger: 'blur'}
                        ],
                        value: [
                            {required: true, message: '配置值不能为空', trigger: 'blur'}
                        ],
                        status: [
                            {required: true, message: '状态不能为空', trigger: 'change'}
                        ]
                    }
                }
            }
        },
        created() {
            this.queryConfig();
        },
        methods: {
            handleSearch() {
                this.queryConfig();
            },
            handleEdit(row) {
                this.form.title = "修改配置项";
                this.form.isAdd = false;
                this.form.config = JSON.parse(JSON.stringify(row));
                if (this.form.config.status) {
                    this.form.config.status = this.form.config.status.value;
                }
                if (this.form.config.configCls) {
                    this.form.config.configCls = this.form.config.configCls.value;
                }
                this.form.show = true;
            },
            handleCreate() {
                this.form.title = "新增配置项";
                this.form.isAdd = true;
                this.form.config = {};
                this.form.show = true;
            },
            handleChangePage(page) {
                this.search.page = page;
                this.queryConfig();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.queryConfig();
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createConfig();
                        } else {
                            this.updateConfig();
                        }
                        this.form.show = false;
                        setTimeout(this.queryConfig, 1000);
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            async queryConfig() {
                this.content.loading = true;
                try {
                    let res = await post("/system/config/list", this.search);
                    if (res.status == this.rescode.OK) {
                        this.content.records = res.data.records;
                        this.content.total = res.data.total;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
                this.content.loading = false;
            },
            async createConfig() {
                try {
                    let res = await post("/system/config/add", this.form.config);
                    if (res.status = this.rescode.OK) {
                        this.$Message.success("新增成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateConfig() {
                try {
                    let res = await post("/system/config/update/" + this.form.config.id, this.form.config);
                    if (res.status = this.rescode.OK) {
                        this.$Message.success("更新成功");
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
