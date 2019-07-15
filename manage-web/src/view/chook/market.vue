<template>
    <div>
        <Card>
            <!-- 操作 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
                        <Button type="success" icon="ios-refresh-circle-outline" @click="handleRefresh">查询</Button>
                    </Col>
                </Row>
            </div>
            <!-- 数据展示 -->
            <Table border :loading="content.loading" :columns="content.columns" :data="content.records"></Table>
            <!-- 新增修改 -->
            <Drawer class="add-update-drawer" :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false">
                <Form :model="form.market" ref="formMarket" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="集市名称: " label-position="left" :label-width="80" prop="name">
                        <Input v-model="form.market.name" placeholder="请输入集市名称" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="备注: " label-position="left" :label-width="80" prop="remark">
                        <Input v-model="form.market.remark" placeholder="请输入集市名称" type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formMarket')">提交</Button>
                        <Button style="margin-left: 8px" @click="handleReset('formMarket')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>
        </Card>
    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";

    export default {
        name: "market",
        data() {
            return {
                content: {
                    loading: false,
                    records: [],
                    columns: [
                        {
                            title: '集市ID',
                            key: 'id',
                            width: 100
                        },
                        {
                            title: '集市名称',
                            key: 'name',
                            width: 120
                        },
                        {
                            title: '备注',
                            key: 'remark',
                        },
                        {
                            title: '创建时间',
                            key: 'createTime',
                            width: 150
                        },
                        {
                            title: '修改时间',
                            key: 'updateTime',
                            width: 150
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 150,
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
                                }, '编辑')
                            }
                        }
                    ]
                },
                form: {
                    title: "新增集市信息",
                    isAdd: true,
                    show: false,
                    market: {},
                    ruleValidate: {
                        name: [
                            {required: true, message: '集市名称不能为空', trigger: 'blur'}
                        ]
                    }
                }
            }
        },
        created() {
            this.queryAllList();
        },
        methods: {
            handleCreate() {
                this.form.isAdd = true;
                this.form.title = "新增集市信息";
                this.form.show = true;
                this.form.market = {};
            },
            handleRefresh() {
                this.queryAllList();
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.form.isAdd) {
                            this.createMarket()
                        } else {
                            this.updateMarket()
                        }
                        this.form.show = false;
                        setTimeout(this.queryAllList, 1000);
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            handleEdit(row) {
                this.form.isAdd = false;
                this.form.title = "更新集市信息";
                this.form.market = row;
                this.form.show = true;
            },
            async queryAllList() {
                this.content.loading = true;
                try {
                    let res = await get("api/pomelomgm/market/list/all");
                    if (res.status == this.rescode.OK) {
                        this.content.records = res.data;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
                this.content.loading = false;
            },
            async createMarket() {
                try {
                    let res = await post("api/pomelomgm/market/add", this.form.market);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("新增成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateMarket() {
                try {
                    let res = await post("api/pomelomgm/market/update/" + this.form.market.id, this.form.market);
                    if (res.status == this.rescode.OK) {
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
