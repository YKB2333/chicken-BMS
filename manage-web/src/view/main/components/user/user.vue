<template>
    <div class="user-avator-dropdown">
        <Dropdown @on-click="handleClick">
            <Avatar :src="userAvator"/>
            <span style="font-size: 15px;margin-right: 10px;margin-left: 10px">{{username}}</span>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    import './user.less'
    import {mapActions} from 'vuex'

    export default {
        name: 'User',
        props: {
            userAvator: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                username: localStorage.getItem('username')
            }
        },
        methods: {
            ...mapActions([
                'handleLogOut'
            ]),
            handleClick(name) {
                switch (name) {
                    case 'logout':
                        this.handleLogOut().then(() => {
                            this.$router.push({
                                name: 'login'
                            })
                        })
                        break
                }
            }
        }
    }
</script>
