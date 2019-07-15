<template>
    <div>
        <Card>
            <!-- 操作 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
                        <Button type="success" icon="ios-loading" @click="handleRefre">刷新</Button>
                    </Col>
                </Row>
            </div>

            <!-- 数据展示 -->
            <div class="adver-list">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
            </div>

            <!-- 新增修改 -->
            <Drawer
                    :title="form.title"
                    v-model="form.show"
                    width="720"
                    :mask-closable="false"
                    :styles="styles">
                <Form :model="form.adver" ref="formAdver" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="类型: " label-position="left" :label-width="80" prop="type">
                        <RadioGroup v-model="form.adver.type" type="button" @on-change="handleChangeType">
                            <Radio :label="0">开机广告</Radio>
                            <Radio :label="1">关机广告</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="广告主: " label-position="left" :label-width="80" prop="advertisers">
                        <Input v-model="form.adver.advertisers" placeholder="请输入广告主" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="标题: " label-position="left" :label-width="80" prop="title">
                        <Input v-model="form.adver.title" placeholder="请输入广告标题" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="投放时间: " label-position="left" :label-width="80" prop="date">
                        <DatePicker v-model="form.adver.date" type="datetime" placeholder="Select date and time"
                                    style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="监测信息: " label-position="left" :label-width="80" prop="monitor">
                        <Input v-model="form.adver.monitor" placeholder="请输入监测信息" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="状态: " label-position="left" :label-width="80" prop="status">
                        <RadioGroup v-model="form.adver.status" type="button">
                            <Radio :label=1>正常</Radio>
                            <Radio :label=0>下架</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem v-if="form.adver.type == 0" label="开机图片: " label-position="left" :label-width="80"
                              prop="image">
                        <UploadImg :src="form.adver.image" @changeSrc="handleChangeImage"/>
                    </FormItem>
                    <FormItem :label="form.videoLabel" label-position="left" :label-width="80" prop="image">
                        <UploadDownload :src="form.adver.video" action='/system/upload/file/video'
                                        @changeFileSrc="handleChangeVideo"/>
                    </FormItem>
                    <FormItem label="投放盟友: " label-position="left" :label-width="80" prop="allyId">
                        <Select v-model="form.adver.allyId" placeholder="请选择投放盟友" style="width: 300px" clearable>
                            <Option v-for="ally in option.allys" :value="ally.id" :key="ally.id">{{ally.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备注: " label-position="left" :label-width="80" prop="remark">
                        <Input v-model="form.adver.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}"
                               placeholder="请输入备注"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formAdver')">提交</Button>
                        <Button style="margin-left: 8px" @click="handleReset('formAdver')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>


            <!-- 展示详情 -->
            <Modal
                    v-model="view.show"
                    title="盟友详细信息">
                <p>ID: &nbsp;&nbsp;{{view.adver.id}}</p>
                <p>类型: &nbsp;&nbsp;{{view.adver.type}}</p>
                <p>广告主: &nbsp;&nbsp;{{view.adver.advertisers}}</p>
                <p>标题: &nbsp;&nbsp;{{view.adver.title}}</p>
                <p>投放时间: &nbsp;&nbsp;{{view.adver.date}}</p>
                <p>监测信息: &nbsp;&nbsp;{{view.adver.monitor}}</p>
                <p>状态: &nbsp;&nbsp;{{view.adver.status}}</p>
                <p>开机图片: &nbsp;&nbsp;{{view.adver.image}}</p>
                <p>开机视屏: &nbsp;&nbsp;{{view.adver.video}}</p>
                <p>投放盟友: &nbsp;&nbsp;{{view.adver.allyId}}</p>
                <p>备注: &nbsp;&nbsp;{{view.adver.remark}}</p>
            </Modal>

        </Card>
    </div>
</template>

<script>
    import UploadImg from "../main/components/upload-img/upload-img";
    import UploadDownload from "../main/components/upload-download/upload-download";
    import {post} from "../../libs/axios-cfg";

    export default {
        components: {UploadDownload, UploadImg},
        data() {
            return {
                option: {
                    allys: []
                },
                view: {
                    show: false,
                    adver: {}
                },
                content: {
                    loading: false,
                    columns: [
                        {
                            title: 'ID',
                            key: 'id',
                            width: 80,
                        },
                        {
                            title: '广告主',
                            key: 'advertisers',
                            width: 180,
                        },
                        {
                            title: '标题',
                            key: 'title',
                        },
                        {
                            title: '投放时间',
                            key: 'date',
                            width: 180,
                        },
                        {
                            title: '创建时间',
                            key: 'advertisers',
                            width: 180,
                        },
                        {
                            title: '状态',
                            key: 'status',
                            width: 80,
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
                                            this.handleShowDetail(params.row);
                                        }
                                    }
                                }, '查看详情')
                            }
                        }
                    ],
                    data: []
                },
                search: {},
                form: {
                    title: "新增广告",
                    isAdd: true,
                    show: false,
                    videoLabel: "开机视频",
                    adver: {
                        type: 0,
                        advertisers: null,
                        title: null,
                        date: null,
                        monitor: null,
                        status: null,
                        image: null,
                        video: null,
                        allyId: null
                    },
                    ruleValidate: {
                        advertisers: [
                            {required: true, message: '广告主不能为空', trigger: 'blur'}
                        ],
                        title: [
                            {required: true, message: '标题不能为空', trigger: 'blur'}
                        ],
                        monitor: [
                            {required: true, message: '请输入监测信息', trigger: 'blur'}
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
            this.queryAllyInfo();
            this.queryAdver();
        },
        methods: {
            handleCreate() {
                this.form.show = true;
                this.form.adver = {};
                this.form.isAdd = true
            },
            handleShowDetail(row) {
                this.view.adver = row;
                this.view.show = true;
            },
            handleRefre() {
                this.queryAdver();
            },
            handleChangeImage(url) {
                this.form.adver.image = url;
            },
            handleChangeVideo(url) {
                this.form.adver.video = url;
            },
            handleChangeType(val) {
                if (val == 1) {
                    this.form.videoLabel = "关机视频";
                } else {
                    this.form.videoLabel = "开机视频";
                }
            },
            handleSubmit(name) {
                var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (self.form.isAdd) {
                            this.createAdver();
                        } else {
                            this.updateAdver();
                        }
                        this.form.show = false;
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            async createAdver() {
                try {
                    let res = await post("/api/mgm/adver/add", this.form.adver);
                    if (res.status == 1) {
                        this.$Message.success("新增成功");
                    } else {
                        this.$Message.error("新增失败");
                    }
                    this.queryAdver();
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateAdver() {
                try {
                    let res = await post("/api/mgm/adver/update", this.form.adver);
                    if (res.status == 1) {
                        this.$Message.success("更新成功");
                    } else {
                        this.$Message.error("更新失败");
                    }
                    this.queryAdver();
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryAdver() {
                this.content.loading = true;
                try {
                    let res = await post('/api/mgm/adver/list', this.search);
                    if (res.status == 1) {
                        this.content.data = res.data.records;
                    } else {
                        this.$Message.error("数据加载失败");
                    }
                } catch (error) {
                    this.$throw(error)
                }
                this.content.loading = false;
            },
            async queryAllyInfo() {
                try {
                    let res = await post('/api/mgm/ally/list', {});
                    this.option.allys = res.data.records;
                } catch (error) {
                    this.$throw(error)
                }
            }
        }
    }
</script>

<style scoped>

</style>
