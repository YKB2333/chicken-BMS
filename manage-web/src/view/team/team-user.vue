<template>
    <div>
        <Card>
            <!-- 首次进入没有选择用户就强制选择用户 -->
            <Modal title="请选择团队长用户(必选)" :closable="false" v-model="selectUser.show" @on-ok="handleSelectUserOk"
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

            <!-- 用户团队下的用户名称 -->
            <div class="user-chook-list" style="overflow: hidden">
                <div>
                    <p class="margin-bottom-10">团队ID: {{user.teamId}}</p>
                    <p class="margin-bottom-10">团队长用户名: {{user.username}}</p>
                    <p class="margin-bottom-10">团队长手机号: {{user.phone}}</p>
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
        name: "team-user",
        data() {
            return {
                options: {
                    users: [],
                    usersLoading: false,
                },
                query: {
                    userId: null
                },
                selectUser: {
                    show: false
                },
                search: {
                    userId: null,
                    page: 1,
                    pageSize: 10
                },
                user: {
                    teamId: null,
                },
                content: {
                    loading: false,
                    total: 0,
                    records: [],
                    columns: [
                        {
                            title: '用户标识',
                            key: 'userId',
                        },
                        {
                            title: '用户名称',
                            key: 'username',
                        },
                        {
                            title: '手机号码',
                            key: 'phone',
                        },
                        {
                            title: '用户等级',
                            key: 'rank',
                        },
                        {
                            title: '团队层级',
                            key: 'hierarchy',
                            render: (h, params) => {
                                return h('span', {}, params.row.hierarchy.name);
                            }
                        },
                        {
                            title: '团队名称',
                            key: 'teamName'
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
                this.queryTeamUser();
            }
        },
        methods: {
            handleSelectUserOk() {
                this.$router.push("/team/user/list?userId=" + this.query.userId + "&timestamp=" + new Date().getTime());
                this.queryUser();
                this.queryTeamUser();
            },
            handleSelectUserCancel() {
                this.$router.push("/home");
            },
            handleChangePage(page) {
                this.search.page = page;
                this.queryTeamUser();
            },
            handleChangePageSize(pageSize) {
                this.search.pageSize = pageSize;
                this.queryTeamUser();
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
                        let teamId = this.user.teamId;
                        this.user = res.data;
                        this.user.teamId = teamId;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (e) {
                    this.$throw(e);
                }
            },
            async queryTeamUser() {
                this.search.userId = this.query.userId;
                try {
                    let res = await post('api/pomelomgm/team/user/list', this.search);
                    if (res.status == this.rescode.OK) {
                        this.content.records = res.data.records;
                        if (this.content.records.length > 0) {
                            this.user.teamId = this.content.records[0].teamId
                        }
                        this.content.total = res.data.total;
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
