<template>
    <div>
        <Card>
            <!-- 条件查询 -->
            <div class="margin-bottom-10">
                <Row>
                    <Col span="6">
                        <label>用户ID: </label>
                        <Input v-model="search.userId" placeholder="请输入用户ID" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>用户名: </label>
                        <Input v-model="search.username" placeholder="请输入用户名称" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>手机号: </label>
                        <Input v-model="search.phone" placeholder="请输入手机号码" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>推荐人ID: </label>
                        <Input v-model="search.parentUserId" placeholder="请输入推荐人ID" style="width: 200px"/>
                    </Col>
                </Row>
                <Row class="margin-top-10">
                    <Col span="6">
                        <label>推荐人名称: </label>
                        <Input v-model="search.parentUserName" placeholder="请输入用户ID" style="width: 200px"/>
                    </Col>
                    <Col span="6">
                        <label>注册时间: </label>
                        <DatePicker v-model="search.dateRange" format="yyyy-MM-dd" type="daterange"
                                    placement="bottom-end"
                                    placeholder="选择注册时间范围" style="width: 200px"></DatePicker>
                    </Col>
                    <Col span="6">
                        <label>状态: </label>
                        <Select v-model="search.status" placeholder="请选择状态" style="width:200px" clearable>
                            <Option v-for="item in option.statuss" :value="item.value" :key="item.value">{{
                                item.label}}
                            </Option>
                        </Select>
                    </Col>
                    <Col span="6">
                        <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
                    </Col>
                </Row>
            </div>

            <!-- 数据展示 -->
            <div class="user-list" style="overflow: hidden">
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
                <Form :model="form.user" ref="formUser" :rules="form.ruleValidate" style="margin-right: 30px">
                    <FormItem label="用户名: " label-position="left" :label-width="80" prop="username">
                        <Input v-model="form.user.username" placeholder="请输入用户名称" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="电话号码: " label-position="left" :label-width="80" prop="phone">
                        <Input v-model="form.user.phone" placeholder="请输入电话号码" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="优先级别: " label-position="left" :label-width="80" prop="rank">
                        <Rate :count=10 v-model="form.user.rank"/>
                    </FormItem>
                    <FormItem label="状态: " label-position="left" :label-width="80" prop="status">
                        <Select v-model="form.user.status" placeholder="请选择状态" style="width:200px">
                            <Option v-for="item in option.statuss" :value="item.value" :key="item.value">{{
                                item.label}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formUser')">提交</Button>
                        <Button style="margin-left: 8px" @click="handleReset('formUser')">重置</Button>
                    </FormItem>

                </Form>
            </Drawer>

            <!-- 设置密码 -->
            <Drawer class="add-update-drawer"
                    :title="formSetPwd.title"
                    v-model="formSetPwd.show"
                    width="720"
                    :mask-closable="false">
                <div class="margin-bottom-10">
                    <p style="font-size: 18px">当前用户: &nbsp;&nbsp;{{formSetPwd.user.username}}</p>
                    <p style="font-size: 18px">当前手机号: &nbsp;&nbsp;{{formSetPwd.user.phone}}</p>
                </div>
                <Form :model="formSetPwd.oper" ref="formSetPwd" :rules="formSetPwd.ruleValidate"
                      style="margin-right: 30px">
                    <FormItem label="密码类型: " label-position="left" :label-width="80" prop="type">
                        <RadioGroup v-model="formSetPwd.oper.pwdType" type="button" size="small">
                            <Radio label="登录密码"></Radio>
                            <Radio label="交易密码"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <!--<FormItem label="旧密码: " label-position="left" :label-width="80" prop="oldPassword">-->
                    <!--<Input v-model="formSetPwd.oper.oldPassword" placeholder="请输入旧密码" style="width: 300px"/>-->
                    <!--</FormItem>-->
                    <FormItem label="新密码: " label-position="left" :label-width="80" prop="password">
                        <Input v-model="formSetPwd.oper.password" placeholder="请输入新密码" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="确认密码: " label-position="left" :label-width="80" prop="rePassword">
                        <Input v-model="formSetPwd.oper.rePassword" placeholder="请确认新密码" style="width: 300px"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmitSetPwd('formSetPwd')">提交
                        </Button>
                        <Button style="margin-left: 8px" @click="handleReset('formSetPwd')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

            <!-- 大米小米操作 -->
            <Drawer class="add-update-drawer"
                    :title="formAccount.title"
                    v-model="formAccount.show"
                    width="720"
                    :mask-closable="false">
                <div class="margin-bottom-10">
                    <p style="font-size: 18px">当前用户: &nbsp;&nbsp;{{formAccount.user.username}}</p>
                    <p style="font-size: 18px">当前手机号: &nbsp;&nbsp;{{formAccount.user.phone}}</p>
                    <p style="font-size: 18px">当前大米值: &nbsp;&nbsp;{{formAccount.user.riceAmount}}</p>
                    <p style="font-size: 18px">当前小米值: &nbsp;&nbsp;{{formAccount.user.milletAmount}}</p>
                </div>
                <Form :model="formAccount.oper" ref="formUserAcct" :rules="formAccount.ruleValidate"
                      style="margin-right: 30px">
                    <FormItem label="状态: " label-position="left" :label-width="80" prop="status">
                        <RadioGroup v-model="formAccount.oper.typeLabel" type="button" size="small">
                            <Radio label="小米"></Radio>
                            <Radio label="团队大米"></Radio>
                            <Radio label="推荐大米"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="操作: " label-position="left" :label-width="80" prop="status">
                        <RadioGroup v-model="formAccount.oper.operateLabel" type="button" size="small">
                            <Radio label="增加"></Radio>
                            <Radio label="减少"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="数量(增减): " label-position="left" :label-width="80" prop="value">
                        <Input v-model="formAccount.oper.value" placeholder="请输入操作的数值" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="操作备注: " label-position="left" :label-width="80" prop="remark">
                        <Input v-model="formAccount.oper.remark" type="textarea" :rows="4" placeholder="请输入备注信息"
                               style="width: 300px"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmitAcctOper('formUserAcct')">
                            提交
                        </Button>
                        <Button style="margin-left: 8px" @click="handleReset('formUserAcct')">重置</Button>
                    </FormItem>
                </Form>
            </Drawer>

            <!-- 送鸡操作 -->
            <Drawer class="add-update-drawer"
                    :title="formAddChook.title"
                    v-model="formAddChook.show"
                    width="720"
                    :mask-closable="false">
                <Form :model="formAddChook.oper" ref="formAddChook" :rules="formAddChook.ruleValidate"
                      style="margin-right: 30px">
                    <FormItem label="集市: " label-position="left" :label-width="80" prop="marketId">
                        <Select v-model="formAddChook.oper.marketId" style="width:200px" placeholder="请选择集市"
                                @on-change="handleChangeMarket" clearable>
                            <Option v-for="maket in option.market" :value="maket.id" :key="maket.id">{{ maket.name }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="柚子鸡: " label-position="left" :label-width="80" prop="chookClsId">
                        <Select v-model="formAddChook.oper.chookClsId" style="width:200px" placeholder="请选择柚子鸡"
                                clearable>
                            <Option v-for="chookCls in option.chookCls" :value="chookCls.id" :key="chookCls.id" :label="chookCls.name">
                                <span>{{ chookCls.name }}</span>
                                <span style="float:right;color:#ccc">【{{chookCls.minValue}}-{{chookCls.maxValue}}】</span>
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="价值: " label-position="left" :label-width="80" prop="value">
                        <Input v-model.number="formAddChook.oper.value" placeholder="请输入赠送鸡的价值(默认为起始价值)"
                               style="width: 300px"/>
                    </FormItem>
                    <FormItem :label-width="80">
                        <Button type="primary" style="margin-left: 30px" @click="handleSubmitAddChook('formAddChook')">
                            提交
                        </Button>
                        <Button style="margin-left: 8px" @click="handleReset('formAddChook')">重置</Button>
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

    export default {
        name: "index",
        data() {
            // 验证手机号是否被占用
            const validatePhone = async (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }
                try {
                    let res = await get('api/pomelomgm/user/phone/verify?phone=' + value + '&userId=' + this.form.user.id);
                    if (res.data) {
                        callback(new Error('该手机号已被注册, 请勿重复'));
                    }
                } catch (error) {
                    callback(error)
                }
            };

            return {
                option: {
                    statuss: [
                        {value: "Y", label: "正常"},
                        {value: "N", label: "冻结"}
                    ],
                    market: [],
                    chookCls: []
                },
                search: {
                    userId: null,
                    username: null,
                    phone: null,
                    parentUserId: null,
                    parentUserName: null,
                    regStartDate: null,
                    regEndDate: null,
                    dateRange: [],
                    status: null,
                    page: 1,
                    pageSize: 10
                },
                content: {
                    loading: false,
                    records: [],
                    columns: [
                        {
                            title: 'ID',
                            key: 'id',
                            width: 80,
                        },
                        {
                            title: '用户名',
                            key: 'username',
                            width: 150,
                        },
                        {
                            title: '电话',
                            key: 'phone',
                            width: 120,
                        },
                        {
                            title: '大米',
                            key: 'riceAmount',
                            width: 120,
                        },
                        {
                            title: '小米',
                            key: 'milletAmount',
                            width: 120,
                        },
                        {
                            title: '总资产',
                            key: 'totalAssets',
                            width: 120,
                        },
                        {
                            title: 'EC币',
                            key: 'ecAmount',
                            width: 120,
                        },
                        {
                            title: '领养中鸡数',
                            key: 'chookCount',
                            width: 120,
                            render: (h, params) => {
                                if (!params.row.chookCount) {
                                    return h('span', {}, '0');
                                }
                                return h('a', {
                                    on: {
                                        click: () => {
                                            this.handleToUserChook(params.row.id);
                                        }
                                    }
                                }, params.row.chookCount);
                            }
                        },
                        {
                            title: '团队人数',
                            key: 'userCount',
                            width: 120,
                            render: (h, params) => {
                                return h('a', {
                                    on: {
                                        click: () => {
                                            this.handleToTeamUser(params.row.id);
                                        }
                                    }
                                }, params.row.userCount);
                            }
                        },
                        {
                            title: '推荐人ID',
                            key: 'parentUserId',
                            width: 90,
                        },
                        {
                            title: '推荐人名称',
                            key: 'parentUserName',
                            width: 150,
                        },
                        {
                            title: '优先级别',
                            key: 'rank',
                            width: 100,
                        },
                        {
                            title: '注册时间',
                            key: 'createTime',
                            width: 170,
                        },
                        {
                            title: '状态',
                            key: 'status',
                            width: 120,
                            render: (h, params) => {
                                let status = "正常";
                                if (params.row.status.value == 'N') {
                                    status = "冻结";
                                }
                                return h('span', {}, status);
                            }
                        },
                        {
                            title: 'EOS账号',
                            key: 'accountNo',
                            width: 120,
                        },
                        {
                            title: 'EOS收币二维码',
                            key: 'qrCode',
                            width: 180,
                            render: (h, params) => {
                                if (params.row.qrCode) {
                                    let imgUrl = this.baseImgUrl + params.row.qrCode;
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
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 280,
                            align: 'center',
                            fixed: 'right',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'info',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleAddChook(params.row)
                                            }
                                        }
                                    }, '送鸡'),
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
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleEditAccount(params.row)
                                            }
                                        }
                                    }, '账户操作'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleEditPwd(params.row)
                                            }
                                        }
                                    }, '设置密码')
                                ]);
                            }
                        }
                    ],
                    total: 0
                },
                form: {
                    title: '修改用户信息',
                    isAdd: false,
                    show: false,
                    user: {
                        status: null
                    },
                    ruleValidate: {
                        username: [
                            {required: true, message: '用户名不能为空', trigger: 'blur'}
                        ],
                        phone: [
                            {validator: validatePhone, required: true, trigger: 'blur'}
                        ]
                    }
                },
                formAccount: {
                    title: '大米小米操作',
                    show: false,
                    oper: {
                        typeLabel: '小米',
                        operateLabel: '增加',
                        value: null,
                        remark: null
                    },
                    user: {},
                    ruleValidate: {
                        value: [
                            {required: true, message: '操作数值不能为空', trigger: 'blur'}
                        ],
                        remark: [
                            {required: true, message: '操作备注不能为空', trigger: 'blur'}
                        ]
                    }
                },
                formAddChook: {
                    title: "给用户添加柚子鸡",
                    show: false,
                    oper: {
                        marketId: null,
                        chookClsId: null,
                        value: null
                    },
                    user: {},
                    ruleValidate: {
                        marketId: [
                            {required: true, message: '请选择集市', trigger: 'change', type: 'number'}
                        ],
                        chookClsId: [
                            {required: true, message: '请选择柚子鸡', trigger: 'change', type: 'number'}
                        ]
                    }
                },
                formSetPwd: {
                    title: "设置密码",
                    show: false,
                    oper: {
                        userId: null,
                        pwdType: '登录密码',
                        oldPassword: null,
                        password: null,
                        rePassword: null,
                    },
                    user: {},
                    ruleValidate: {
                        password: [
                            {required: true, message: '请输入密码', trigger: 'blur'}
                        ],
                        rePassword: [
                            {required: true, message: '请输入确认密码', trigger: 'blur'}
                        ],
                    }
                },
                img: {
                    visible: false,
                    url: ''
                },
            }
        },
        created() {
            this.queryUser();
            this.queryAllMarket();
        },
        methods: {
            handleBigImg(url) {
                this.img.url = url;
                this.img.visible = true;
            },
            handleSearch() {
                this.queryUser();
            },
            handleToUserChook(userId) {
                this.$router.push("/user/chook/list?userId=" + userId);
            },
            handleToTeamUser(userId) {
                this.$router.push("/team/user/list?userId=" + userId);
            },
            handleChangePage(page) {
                this.search.page = page;
                this.queryUser();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.queryUser();
            },
            handleAddChook(row) {
                this.formAddChook.show = true;
                this.formAddChook.user = row;
                this.formAddChook.oper = {};
            },
            handleEdit(row) {
                this.form.title = "修改用户信息";
                this.form.isAdd = false;
                this.form.show = true;
                this.form.user = row;
                this.form.user.status = this.form.user.status.value;
            },
            handleEditAccount(row) {
                this.formAccount.user = row;
                this.formAccount.show = true;
                this.formAccount.oper = {
                    typeLabel: '小米',
                    operateLabel: '增加',
                    value: null,
                    remark: null
                };
            },
            handleEditPwd(row) {
                this.formSetPwd.user = row;
                this.formSetPwd.show = true;
                this.formSetPwd.oper = {
                    userId: row.id,
                    pwdType: '登录密码'
                };
            },
            handleChangeMarket(marketId) {
                if (marketId) {
                    this.queryChookClsByMarketId(marketId);
                } else {
                    this.option.chookCls = [];
                    this.formAddChook.oper.chookClsId = null;
                }
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.form.isAdd) {
                            this.$Message.error("操作暂不支持");
                        } else {
                            this.updateUser();
                        }
                        this.form.show = false;
                        setTimeout(this.queryUser, 1000)
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields()
            },
            handleSubmitAddChook(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let chookCls = null;
                        for (let i = 0; i < this.option.chookCls.length; i++) {
                            if (this.option.chookCls[i].id == this.formAddChook.oper.chookClsId) {
                                chookCls = this.option.chookCls[i];
                                break;
                            }
                        };
                        if (chookCls && this.formAddChook.oper.value) {
                            if (chookCls.minValue > this.formAddChook.oper.value || chookCls.maxValue <= this.formAddChook.oper.value) {
                                this.$Message.error("您输入的价值不在该柚子鸡的价值范围内!");
                                return;
                            }
                        }
                        this.createChookObj();
                        this.formAddChook.show = false;
                        setTimeout(this.queryUser, 1000);
                    } else {
                        this.$Message.error('验证不通过!')
                    }
                })
            },
            handleSubmitSetPwd(name) {
                console.info(this.formSetPwd);
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.formSetPwd.oper.password !== this.formSetPwd.oper.rePassword) {
                            this.$Message.error("确认密码不一致, 请重新输入");
                            return;
                        }
                        if (this.formSetPwd.oper.pwdType == "登录密码") {
                            this.settingUpPassword(this.formSetPwd.oper.userId, 1, this.formSetPwd.oper.password);
                        } else if (this.formSetPwd.oper.pwdType == "交易密码") {
                            this.settingUpPassword(this.formSetPwd.oper.userId, 2, this.formSetPwd.oper.password);
                        }
                        this.formSetPwd.show = false;
                    } else {
                        this.$Message.error('验证不通过');
                    }
                });
            },
            handleSubmitAcctOper(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        switch (this.formAccount.oper.typeLabel) {
                            case "小米":
                                this.formAccount.oper['accountType'] = 'MILLET';
                                break;
                            case "团队大米":
                                this.formAccount.oper['accountType'] = 'TEAMRICE';
                                break;
                            case "推荐大米":
                                this.formAccount.oper['accountType'] = 'RECOMMENDRICE';
                                break;
                        }
                        switch (this.formAccount.oper.operateLabel) {
                            case "增加":
                                this.formAccount.oper['tradeDire'] = 'I';
                                break;
                            case "减少":
                                this.formAccount.oper['tradeDire'] = 'O';
                                break;
                        }
                        this.formAccount.oper['userId'] = this.formAccount.user.id;
                        this.formAccount.oper['accountId'] = this.formAccount.user.accountId;
                        this.operAccount();
                        this.formAccount.show = false;
                    }
                });
            },
            async operAccount() {
                try {
                    let res = await post("api/pomelomgm/account/operate", this.formAccount.oper);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("操作成功");
                        this.queryUser();
                    } else {
                        this.$Message.error(res.msg);
                    }
                    this.formAccount.oper = {
                        typeLabel: '小米',
                        operateLabel: '增加',
                        value: null,
                        remark: null
                    };
                    this.formAccount.user = {};
                } catch (e) {
                    this.$throw(e);
                }
            },
            async updateUser() {
                try {
                    let res = await post("api/pomelomgm/user/update/" + this.form.user.id, this.form.user);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("更新成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                    this.queryUser();
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryUser() {
                if (this.search.dateRange && this.search.dateRange.length == 2) {
                    if (this.search.dateRange[0] != "") {
                        this.search.regStartDate = this.search.dateRange[0].format("yyyy-MM-dd hh:mm:ss");
                    } else {
                        this.search.regStartDate = null;
                    }
                    if (this.search.dateRange[1] != "") {
                        this.search.regEndDate = this.search.dateRange[1].format("yyyy-MM-dd hh:mm:ss");
                    } else {
                        this.search.regEndDate = null;
                    }
                }
                this.content.loading = true;
                try {
                    let res = await post("api/pomelomgm/user/list", this.search);
                    if (res.status == 1) {
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
            async queryAllMarket() {
                try {
                    let res = await get("api/pomelomgm/market/list/all");
                    if (res.status == 1) {
                        this.option.market = res.data;
                    } else {
                        this.option.market = [];
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryChookClsByMarketId(marketId) {
                try {
                    let res = await post("api/pomelomgm/chook/cls/list", {marketId: marketId, status: 'Y'});
                    if (res.status == this.rescode.OK) {
                        this.option.chookCls = res.data.records;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async createChookObj() {
                console.info(this.formAddChook.oper);
                try {
                    let res = await get(`api/pomelomgm/user/create/chookobj?userId=${this.formAddChook.user.id}&chookClsId=${this.formAddChook.oper.chookClsId}&value=${this.formAddChook.oper.value && this.formAddChook.oper.value != null ? this.formAddChook.oper.value : ''}`);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("创建柚子鸡成功");
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async settingUpPassword(userId, passwordType, password) {
                let md5Password = this.$md5(password);
                try {
                    let res = await get(`api/pomelomgm/user/setting-up-password?userId=${userId}&passwordType=${passwordType}&password=${md5Password}`);
                    if (res.status == this.rescode.OK) {
                        this.$Message.success("密码设置成功");
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
