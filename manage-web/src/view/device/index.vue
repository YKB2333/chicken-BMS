<template>
    <div>
        <Card>
            <!-- 数据搜索 -->
            <div class="device-search margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>盟友名称: </label>
                        <Input v-model="search.allyName" placeholder="请输入盟友名称" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>MAC码: &nbsp;&nbsp;</label>
                        <Input v-model="search.deviceMac" placeholder="请输入MAC码" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>IP地址: &nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <Input v-model="search.ipAddress" placeholder="请输入IP地址" style="width: 200px"/>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="6">
                        <label>终端状态: </label>
                        <Select v-model="search.onlineStatus" placeholder="请选择终端状态" style="width: 200px" clearable>
                            <Option value="0" key="0">断网</Option>
                            <Option value="1" key="1">联网</Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <label>软件版本: </label>
                        <Input v-model="search.version" placeholder="请输入软件版本" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>创建时间: </label>
                        <DatePicker :value="search.dateRange" format="yyyy-MM-dd" type="daterange" placeholder="创建时间范围"
                                    style="width: 200px"/>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="6">
                        <label>是否激活: </label>
                        <Select v-model="search.status" placeholder="请选择终端状态" style="width: 200px" clearable>
                            <Option value="1" key="1">是</Option>
                            <Option value="0" key="0">否</Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <label>品牌名称: </label>
                        <Input v-model="search.brandName" placeholder="请输入品牌名称" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                        <Button type="warning" icon="ios-albums-outline" @click="handleImport">导入设备</Button>
                    </Col>
                </Row>
            </div>
            <div class="brand-list" style="overflow: hidden">
                <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
                <div class="margin-top-8"></div>
                <Page :total="content.total" @on-change="handleChangePage" @on-page-size-change="handleChangePageSize"
                      show-sizer show-total class="margin-right-10" style="display: inline-flex;float: right;"/>
            </div>


            <!-- 导入设备 -->
            <Modal
                    v-model="importShow"
                    title="导入设备数据"
                    @on-ok="importSubmit"
                    @on-cancel="importCancel">
                <Form ref="importData" :model="importData" :rules="importDataRule" :label-width="80">
                    <FormItem label="文件" prop="deviceFile">
                        <Upload :action="actionUrl" :headers="headers" :with-credentials=true
                                :on-success="handleUploadSuccess">
                            <Button icon="ios-cloud-upload-outline">选择文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="盟友" prop="allyId">
                        <Select v-model="importData.allyId" style="width:200px" @on-change="handleChangeAlly" clearable>
                            <Option v-for="ally in option.allys" :value="ally.id" :key="ally.id" placeholder="请选择盟友">
                                {{ally.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="品牌" prop="brandId">
                        <Select v-model="importData.brandId" placeholder="请选择品牌" style="width:200px" clearable>
                            <Option v-for="brand in option.brands" :value="brand.id" :key="brand.id"
                                    placeholder="请选择盟友">
                                {{brand.name}}
                            </Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>


            <!-- 展示信息 -->
            <Modal
                    v-model="view.show"
                    title="盟友详细信息">
                <p>ID: &nbsp;&nbsp;{{view.device.id}}</p>
                <p>注册时间: &nbsp;&nbsp;{{new Date(view.device.registerTime).format("yyyy-MM-dd hh:mm:ss")}}</p>
                <p>设备型号: &nbsp;&nbsp;{{view.device.model}}</p>
                <p>盟友名称: &nbsp;&nbsp;{{view.device.allyName}}</p>
                <p>无线MAC码: &nbsp;&nbsp;{{view.device.macNum}}</p>
                <p>设备MAC码: &nbsp;&nbsp;{{view.device.deviceMac}}</p>
                <p>IP地址: &nbsp;&nbsp;{{view.device.ipAddress}}</p>
                <p>系统版本: &nbsp;&nbsp;{{view.device.version}}</p>
                <p>系统信息: &nbsp;&nbsp;{{view.device.systemInfo}}</p>
                <p>更新时间: &nbsp;&nbsp;{{new Date(view.device.updateTime).format('yyyy-MM-dd hh:mm:ss')}}</p>
                <p>心跳时间: &nbsp;&nbsp;{{view.device.heartbeatTime && new
                    Date(view.device.heartbeatTime).format('yyyy-MM-dd hh:mm:ss')}}</p>
                <p>设备状态: &nbsp;&nbsp;{{view.device.status == 1? '已激活':'未激活'}}</p>
                <p>品牌名称: &nbsp;&nbsp;{{view.device.brandName}}</p>
            </Modal>

            <Modal v-model="settingBrand.show" title="设置品牌" @on-ok="settingBrandSubmit">
                <Form ref="settingBrand" :model="settingBrand" :label-width="80">
                    <FormItem label="品牌" prop="brandId">
                        <Select v-model="settingBrand.brandId" placeholder="请选择品牌" style="width:200px">
                            <Option v-for="brand in option.brands" :value="brand.id" :key="brand.id"
                                    placeholder="请选择品牌">
                                {{brand.name}}
                            </Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        </Card>
    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";
    import config from '../../config/index';

    export default {
        data() {
            const baseRequestUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
            return {
                action: "",
                baseRequestUrl: baseRequestUrl,
                actionUrl: baseRequestUrl + "/system/upload/file/device",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': localStorage.getItem('csrf-token')
                },
                credentials: true,
                option: {
                    allys: [],
                    brands: []
                },
                importShow: false,
                importData: {
                    allyId: null,
                    brandId: null,
                    fileUrl: null
                },
                importDataRule: {},
                search: {
                    allyName: null,
                    deviceMac: null,
                    ipAddress: null,
                    onlineStatus: null,
                    status: null,
                    version: null,
                    dateRange: [],
                    startDate: null,
                    endDate: null,
                    brandName: null,
                    page: 1,
                    pageSize: 10
                },
                settingBrand: {
                    show: false,
                    id: null,
                    brandId: null
                },
                view: {
                    show: false,
                    device: {}
                },
                content: {
                    loading: false,
                    total: 0,
                    data: [],
                    columns: [
                        {
                            title: 'ID',
                            key: 'id',
                            width: 80,
                        },
                        {
                            title: '注册时间',
                            key: 'registerTime',
                            width: 180,
                            render: (h, params) => {
                                return h('span', {}, new Date(params.row.registerTime).format("yyyy-MM-dd hh:mm:ss"));
                            }
                        },
                        {
                            title: '设备型号',
                            key: 'model',
                            width: 130,
                        },
                        {
                            title: '盟友ID',
                            key: 'allyId',
                            width: 80,
                        },
                        {
                            title: '盟友名称',
                            key: 'allyName',
                            width: 120,
                        },
                        {
                            title: '无线MAC码',
                            key: 'allyName',
                            width: 120,
                        },
                        {
                            title: '设备MAC码',
                            key: 'deviceMac',
                            width: 130,
                        },
                        {
                            title: 'IP地址',
                            key: 'ipAddress',
                            width: 110,
                        },
                        {
                            title: '软件版本',
                            key: 'version',
                            width: 100,
                        },
                        {
                            title: '在线状态',
                            key: 'onlineStatus',
                            width: 90,
                        },
                        {
                            title: '品牌名称',
                            key: 'brandName',
                            width: 120,
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 380,
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
                                                this.handlePushVersion(params.row)
                                            }
                                        }
                                    }, '版本推送'),
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleSettingBrand(params.row)
                                            }
                                        }
                                    }, '设置品牌'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.hanldeRemove(params.row)
                                            }
                                        }
                                    }, '删除'),
                                    h('Checkbox', {
                                        on: {
                                            change: () => {
                                                this.handleBlackStatsu(params.row);
                                            }
                                        }
                                    }, '黑屏'),
                                ])
                            }
                        }
                    ]
                }
            }
        },
        created() {
            this.queryDevice();
            this.queryAllyInfo();
        },
        methods: {
            handleShow(row) {
                this.view.show = true;
                this.view.device = row;
            },
            handlePushVersion(row) {
                console.info(row);
            },
            handleSettingBrand(row) {
                this.queryBrand(row.allyKey);
                this.settingBrand.id = row.id;
                this.settingBrand.brandId = row.brandId;
                this.settingBrand.show = true;
            },
            settingBrandSubmit() {
                this.settingBrandOper(this.settingBrand.id, this.settingBrand.brandId);
            },
            handleBlackStatsu(row) {
                console.info(row);
            },
            hanldeRemove(row) {
                this.removeDevice(row.id);
            },
            handleSearch() {
                this.queryDevice();
            },
            handleChangePage(page) {
                this.search.page = page;
                this.queryDevice();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.queryDevice();
            },
            handleImport() {
                this.importShow = true;
            },
            handleCreate() {

            },
            importSubmit() {
                this.importDevice();
            },
            importCancel() {
                this.importShow = false;
            },
            handleChangeAlly(val) {
                let allyKey = null;
                for (let i = 0; i < this.option.allys.length; i++) {
                    let res = this.option.allys[i];
                    if (res.id == val) {
                        allyKey = res.key;
                        this.option.brands = [];
                        this.importData.brandId = null;
                        this.queryBrand(allyKey);
                        break;
                    }
                }
            },
            handleUploadSuccess(res, file) {
                this.importData.fileUrl = res.data;
            },
            async queryDevice() {
                this.content.loading = true;
                try {
                    console.info(this.search.dateRange);
                    if (this.search.dateRange && this.search.dateRange.length > 0) {
                        this.search.startDate = this.search.dateRange[0];
                        this.search.endDate = this.search.dateRange[1];
                    }
                    let res = await post('/api/mgm/deviceinfo/list', this.search);
                    this.content.data = res.data.records;
                    this.content.total = res.data.total;
                } catch (error) {
                    this.$throw(error)
                }
                this.content.loading = false
            },
            async queryAllyInfo() {
                try {
                    let res = await post('/api/mgm/ally/list', {});
                    this.option.allys = res.data.records;
                } catch (error) {
                    this.$throw(error)
                }
            },
            async queryBrand(allyKey) {
                try {
                    let res = await post('/api/mgm/brandinfo/list', {allyKey: allyKey});
                    this.option.brands = res.data.records;
                } catch (error) {
                    this.$throw(error);
                }
            },
            async removeDevice(id) {
                try {
                    let res = await post('/api/mgm/deviceinfo/remove/' + id);
                    if (res.status == 1) {
                        this.$Message.success("删除成功");
                    }
                    this.queryDevice();
                } catch (error) {
                    this.$throw(error);
                }
            },
            async importDevice() {
                try {
                    let res = await post('/api/mgm/deviceinfo/import', this.importData);
                    this.queryDevice();
                } catch (error) {
                    this.$throw(error);
                }
            },
            async settingBrandOper(id, brandId) {
                try {
                    let res = await get('/api/mgm/deviceinfo/brand/setting?id=' + id + "&brandId=" + brandId);
                    this.queryDevice();
                } catch (error) {
                    this.$throw(error);
                }
            }
        }
    }
</script>

<style scoped>
</style>
