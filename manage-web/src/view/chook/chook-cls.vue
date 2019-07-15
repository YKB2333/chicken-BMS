<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>状态: &nbsp;&nbsp;</label>
                        <Select v-model="search.status" placeholder="请选择状态" style="width: 150px">
                            <Option v-for="status in options.status" :value="status.value" :key="status.value">
                                {{status.label }}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <label>集市: &nbsp;&nbsp;</label>
                        <Select v-model="search.marketId" style="width:200px" placeholder="请选择集市" clearable>
                            <Option v-for="maket in options.market" :value="maket.id" :key="maket.id">{{ maket.name }}
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

            <!-- 新增修改 -->
            <Drawer class="add-update-drawer"
                    :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false">
                <Form :model="form.chookCls" ref="formChookCls" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="集市: " label-position="left" :label-width="100" prop="marketId">
                        <Select v-model="form.chookCls.marketId" style="width:300px" placeholder="请选择集市" clearable>
                            <Option v-for="maket in options.market" :value="maket.id" :key="maket.id">{{ maket.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="鸡名称: " label-position="left" :label-width="100" prop="name">
                        <Input v-model="form.chookCls.name" placeholder="请输入柚子鸡名称" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="最小价值: " label-position="left" :label-width="100" prop="minValue">
                        <Input v-model.number="form.chookCls.minValue" placeholder="请输入最小价值" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="最大价值: " label-position="left" :label-width="100" prop="maxValue">
                        <Input v-model.number="form.chookCls.maxValue" placeholder="请输入最大价值" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="鸡图片: " label-position="left" :label-width="100" prop="icon">
                        <UploadImg :src="form.chookCls.icon" @changeSrc="handleChangeIcon"/>
                    </FormItem>
                    <FormItem label="领养时间: " label-position="left" :label-width="100" prop="timeRange">
                        <TimePicker v-model="form.chookCls.timeRange" format="HH:mm:ss" type="timerange"
                                    placement="bottom-end" placeholder="选择领养时间"
                                    style="width: 300px"></TimePicker>
                    </FormItem>
                    <FormItem label="预约消耗小米: " label-position="left" :label-width="100" prop="subValue">
                        <Input v-model.number="form.chookCls.subValue" placeholder="请输入预约消耗小米" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="即抢领消耗小米: " label-position="left" :label-width="100" prop="robValue">
                        <Input v-model.number="form.chookCls.robValue" placeholder="请输入即抢领消耗小米" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="领养周期: " label-position="left" :label-width="100" prop="cycle">
                        <Input v-model.number="form.chookCls.cycle" placeholder="请输入领养周期" style="width: 300px">
                            <span slot="append">天</span>
                        </Input>
                    </FormItem>
                    <FormItem label="周期收益率: " label-position="left" :label-width="100" prop="changeRatio">
                        <Input v-model.number="form.chookCls.changeRatio" placeholder="请输入领养周期收益率%"
                               style="width: 300px">
                            <span slot="append">%</span>
                        </Input>
                    </FormItem>
                    <FormItem label="交易奖励EC币: " label-position="left" :label-width="110" prop="ecAward">
                        <Input v-model.number="form.chookCls.ecAward" placeholder="请输入交易成功奖励EC币个数"
                               style="width: 290px"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formChookCls')">提交
                        </Button>
                        <Button style="margin-left: 8px" @click="handleReset('formChookCls')">重置</Button>
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
    import {get, post} from "../../libs/axios-cfg";
    import UploadImg from "../main/components/upload-img/upload-img";

    export default {
        name: "chook-cls",
        components: {UploadImg},
        data() {
            return {
                img: {
                    visible: false,
                    url: ''
                },
                options: {
                    status: [
                        {value: "Y", label: "生效"},
                        {value: "N", label: "失效"}
                    ],
                    market: []
                },
                search: {
                    status: 'Y',
                    marketId: null,
                    page: 1,
                    pageSize: 10
                },
                content: {
                    total: 0,
                    loading: false,
                    records: [],
                    columns: [
                        {
                            title: '柚子鸡ID',
                            key: 'id',
                            width: 100
                        }, {
                            title: '柚子鸡名称',
                            key: 'name',
                            width: 100
                        }, {
                            title: '归属集市',
                            key: 'marketId',
                            width: 100,
                            render: (h, params) => {
                                let marketName = this.marketMap[params.row.marketId];
                                return h('span', {}, marketName);
                            }
                        }, {
                            title: '图片',
                            key: 'icon',
                            width: 130,
                            render: (h, params) => {
                                if (params.row.icon) {
                                    let imgUrl = this.baseImgUrl + params.row.icon;
                                    return h('img', {
                                        attrs: {
                                            src: imgUrl,
                                        },
                                        style: {
                                            width: '80px',
                                            height: '80px'
                                        },
                                        on: {
                                            click: (e) => {
                                                this.handleBigImg(e.srcElement.currentSrc)
                                            }
                                        }
                                    }, '类别icon');
                                } else {
                                    return h('Icon', {
                                        attrs: {
                                            size: 80,
                                            type: "ios-image-outline"
                                        }
                                    });
                                }
                            }
                        }, {
                            title: '价值范围',
                            key: 'valueRange',
                            width: 150,
                            render: (h, params) => {
                                let valueRange = params.row.minValue + " - " + params.row.maxValue;
                                return h('span', {}, valueRange);
                            }
                        }, {
                            title: '领养时间',
                            key: 'adoptTime',
                            width: 180,
                            render: (h, params) => {
                                let adoptTime = params.row.startTime + " - " + params.row.endTime;
                                return h('span', {}, adoptTime);
                            }
                        }, {
                            title: '领养周期(天)',
                            key: 'cycle',
                            width: 120,
                            render: (h, params) => {
                                return h('span', {}, params.row.cycle + "天")
                            }
                        }, {
                            title: '周期收益率(%)',
                            key: 'changeRatio',
                            width: 120,
                            render: (h, params) => {
                                return h('span', {}, params.row.changeRatio * 100 + "%");
                            }
                        }, {
                            title: '预约小米',
                            key: 'subValue',
                            width: 100
                        }, {
                            title: '即抢领养小米',
                            key: 'robValue',
                            width: 120
                        }, {
                            title: '智能合约收益',
                            key: 'ecAward',
                            width: 120
                        }, {
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
                                                this.handleRemove(params.row)
                                            }
                                        }
                                    }, '删除'),
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
                                                this.handleEdit(params.row)
                                            }
                                        }
                                    }, '编辑'),
                                ])
                            }
                        }
                    ]
                },
                form: {
                    title: "新增柚子鸡",
                    show: false,
                    isAdd: true,
                    chookCls: {
                        timeRange: []
                    },
                    ruleValidate: {
                        marketId: [
                            {required: true, message: '请选择集市', trigger: 'blur', type: 'number'}
                        ],
                        name: [
                            {required: true, message: '请输入柚子鸡名称', trigger: 'blur'}
                        ],
                        minValue: [
                            {required: true, message: '请输入最小价值', trigger: 'blur', type: 'number'}
                        ],
                        maxValue: [
                            {required: true, message: '请输入最大价值', trigger: 'blur', type: 'number'}
                        ],
                        icon: [
                            {required: true, message: '请上传鸡图片', trigger: 'blur'}
                        ],
                        timeRange: [
                            {required: true, message: '请选择领养时间范围', trigger: 'blur', type: 'array'}
                        ],
                        subValue: [
                            {required: true, message: '请输入预约消耗小米', trigger: 'blur', type: 'number'}
                        ],
                        robValue: [
                            {required: true, message: '请输入即抢领消耗小米', trigger: 'blur', type: 'number'}
                        ],
                        cycle: [
                            {required: true, message: '请输入领养周期', trigger: 'blur', type: 'number'}
                        ],
                        changeRatio: [
                            {required: true, message: '请输入领养周期收益率', trigger: 'blur', type: 'number'}
                        ],
                        ecAward: [
                            {required: true, message: '请输入交易成功奖励EC币个数', trigger: 'blur', type: 'number'}
                        ]
                    }
                }
            }
        },
        created() {
            this.queryAllMarket();
            this.queryChookCls();
        },
        computed: {
            marketMap() {
                let res = {};
                this.options.market.forEach(e => {
                    res[e.id] = e.name;
                });
                return res;
            }
        },
        methods: {
            handleBigImg(url) {
                this.img.url = url;
                this.img.visible = true;
            },
            handleSearch() {
                this.queryChookCls();
            },
            handleCreate() {
                this.form.title = "新增柚子鸡";
                this.form.show = true;
                this.form.isAdd = true;
                this.form.chookCls = {}
            },
            handleChangePage(page) {
                this.search.page = page;
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
            },
            handleRemove(row) {
                this.$Modal.confirm({
                    title: '确认删除',
                    content: '<p>确认删除柚子鸡?</p>',
                    onOk: () => {
                        this.deleteChookCls(row.id);
                    },
                    onCancel: () => {
                        this.$Message.info('取消删除操作');
                    }
                });
            },
            handleEdit(row) {
                this.form.title = "更新柚子鸡";
                this.form.show = true;
                this.form.isAdd = false;
                this.form.chookCls = JSON.parse(JSON.stringify(row));
                this.form.chookCls.changeRatio = this.form.chookCls.changeRatio * 100;
                let timeRange = [null, null];
                timeRange[0] = row.startTime;
                timeRange[1] = row.endTime;
                this.form.chookCls['timeRange'] = timeRange;
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createChookCls();
                        } else {
                            this.updateChookCls();
                        }
                        this.form.show = false;
                        setTimeout(this.queryChookCls, 1000);
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            handleChangeIcon(icon) {
                this.form.chookCls.icon = icon;
            },
            async queryAllMarket() {
                try {
                    let res = await get("api/pomelomgm/market/list/all");
                    if (res.status == 1) {
                        this.options.market = res.data;
                    } else {
                        this.options.market = [];
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryChookCls() {
                this.content.loading = true;
                try {
                    let res = await post("api/pomelomgm/chook/cls/list", this.search);
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
            async deleteChookCls(id) {
                try {
                    let res = await post("api/pomelomgm/chook/cls/remove/" + id);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("删除成功");
                        this.queryChookCls();
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async createChookCls() {
                this.form.chookCls.startTime = this.form.chookCls.timeRange[0];
                this.form.chookCls.endTime = this.form.chookCls.timeRange[1];
                let body = JSON.parse(JSON.stringify(this.form.chookCls));
                body.changeRatio = this.form.chookCls.changeRatio / 100;
                try {
                    let res = await post("api/pomelomgm/chook/cls/add", body);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("新增柚子鸡成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateChookCls() {
                this.form.chookCls.startTime = this.form.chookCls.timeRange[0];
                this.form.chookCls.endTime = this.form.chookCls.timeRange[1];
                this.form.chookCls.status = this.form.chookCls.status.value;
                let body = JSON.parse(JSON.stringify(this.form.chookCls));
                body.changeRatio = this.form.chookCls.changeRatio / 100;
                try {
                    let res = await post("api/pomelomgm/chook/cls/update/" + this.form.chookCls.id, body);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("更新柚子鸡成功");
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
    .chook-cls {

    }
</style>
