<template>
    <div>
        <Card>
            <!-- 首次进入没有选择用户就强制选择用户 -->
            <Modal title="请选择用户(必选)" :closable="false" v-model="selectUser.show" @on-ok="handleSelectUserOk"
                   @on-cancel="handleSelectUserCancel">
                <Select placeholder="搜索用户, 可通过用户名搜索"
                        v-model="query.userId"
                        filterable
                        remoteid
                        :remote-method="remoteSearchUsers"
                        :loading="options.usersLoading">
                    <Option v-for="user in options.users" :value="user.id" :label="user.username">
                        <span>{{user.username}}</span>
                        <span style="float:right;color:#ccc">{{user.phone}}</span>
                    </Option>
                </Select>
            </Modal>

            <!--用户领养的鸡的列表-->
            <!-- 数据展示 -->
            <div class="user-chook-list" style="overflow: hidden">
                <div>
                    <p>用户名: {{user.username}}</p>
                    <p>手机号: {{user.phone}}</p>
                </div>
                <Table border :loading="content.loading" :columns="content.columns" :data="content.records"></Table>
                <div class="margin-top-8"></div>
                <Page :total="content.total" @on-change="handleChangePage" @on-page-size-change="handleChangePageSize"
                      show-sizer show-total show-elevator class="margin-right-10"
                      style="display: inline-flex;float: right;"/>
            </div>


        </Card>
    </div>
</template>

<script>
    import {get, post} from "../../libs/axios-cfg";

    export default {
        name: "chook",
        data() {
            return {
                options: {
                    users: [],
                    usersLoading: false,
                },
                query: {
                    userId: null,
                },
                selectUser: {
                    show: false,
                },
                search: {
                    userId: null,
                    adoptionStatus: 'ADOPT_COMP',
                    page: 1,
                    pageSize: 10
                },
                user: {},
                content: {
                    loading: false,
                    total: 0,
                    records: [],
                    columns: [
                        {
                            title: '柚子鸡ID',
                            key: 'chookId',
                        },
                        {
                            title: '鸡名称',
                            key: 'name',
                        },
                        {
                            title: '当前价值',
                            key: 'value',
                        },
                        {
                            title: '领养时间',
                            key: 'createTime',
                        }
                    ]
                }
            }
        },
        created() {
            this.query = this.$route.query;
            if (!this.query.userId) {
                this.selectUser.show = true;
            } else {
                this.queryUser();
                this.queryAdoption();
            }
        },
        methods: {
            handleSelectUserOk() {
                this.$router.push("/user/chook/list?userId=" + this.query.userId + "&timestamp=" + new Date().getTime());
                this.queryUser();
                this.queryAdoption();
            },
            handleSelectUserCancel() {
                this.$router.push("/home");
            },
            handleChangePage(page) {
                this.search.page = page;
                this.queryAdoption();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.queryAdoption();
            },
            async remoteSearchUsers(query) {
                if (query !== '') {
                    this.options.usersLoading = true;
                    try {
                        let res = await get("api/pomelomgm/user/search?keyword=" + query);
                        if (res.status == this.rescode.OK) {
                            this.options.users = res.data;
                        } else {
                            this.options.users = [];
                        }
                    } catch (e) {
                        this.$throw(e);
                    }
                    this.options.usersLoading = false;
                } else {
                    this.options.users = [];
                }
            },
            async queryUser() {
                try {
                    let res = await get("api/pomelomgm/user/findone/" + this.query.userId);
                    if (res.status == this.rescode.OK) {
                        this.user = res.data;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryAdoption() {
                this.search.userId = this.query.userId;
                this.content.loading = true;
                try {
                    let res = await post('api/pomelomgm/adoption/list', this.search);
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
            }
        }
    }
</script>

<style scoped>

</style>
