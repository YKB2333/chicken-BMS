import Main from '@/view/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            hideInMenu: true,
            showAlways: true
        },
        // component: () => import('@/view/login')
        component: resolve => require(["@/view/login"], resolve),
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '登录',
            hideInMenu: true,
            showAlways: true
        },
        // component: () => import('@/view/home')
        component: resolve => require(["@/view/home"], resolve),
    },
    {
        path: '/layer',
        name: 'layer',
        meta: {
            title: '登录',
            hideInMenu: true,
            showAlways: true
        },
        // component: () => import('@/view/layer')
        component: resolve => require(["@/view/layer"], resolve),
    },
    // {
    //     path: '/',
    //     name: '_home',
    //     redirect: '/home',
    //     component: Main,
    //     meta: {
    //         hideInMenu: true,
    //         notCache: true,
    //         showAlways: true
    //     },
    //     children: [
    //         {
    //             path: '/home',
    //             name: 'home',
    //             meta: {
    //                 hideInMenu: true,
    //                 title: '首页',
    //                 notCache: true
    //             },
    //             component: resolve => require(["@/view/subscribe/statistics"], resolve),
    //         }
    //     ]
    // },
    {
        path: '/system',
        name: 'doc',
        component: Main,
        meta: {
            title: '系统设置',
            icon: 'md-cog',
            showAlways: true
        },
        children: [
            {
                path: 'user',
                meta: {icon: 'md-people', title: '用户管理', access: ['system:user:list']},
                name: 'system_user',
                component: resolve => require(["@/view/system/user"], resolve),
            },
            {
                path: 'person-stalker',
                meta: {icon: 'md-body', title: '角色管理',},
                name: 'system_role',
                component: resolve => require(["@/view/system/role"], resolve),
            },
            {
                path: 'resource',
                meta: {icon: 'ios-lock', title: '资源管理', access: ['system:resource:list']},
                name: 'system_resource',
                component: resolve => require(["@/view/system/resource"], resolve),
            },
            {
                path: 'log',
                meta: {icon: 'ios-aperture', title: '系统日志', access: ['system:log:list']},
                name: 'system_log',
                component: resolve => require(["@/view/system/log"], resolve),
            }
        ]
    },
    {
        path: '/platform',
        name: 'platform',
        component: Main,
        meta: {
            title: '平台管理',
            icon: 'md-funnel',
            showAlways: true
        },
        children: [
            {
                path: 'config',
                meta: {icon: 'ios-card-outline', title: '平台配置', access: ['platform:config']},
                name: 'platform_config',
                component: resolve => require(["@/view/system/config"], resolve),
            },
            {
                path: 'sysmsg',
                meta: {icon: 'ios-mail-outline', title: '系统消息', access: ['platform:sysmsg']},
                name: 'platform_sysmsg',
                component: resolve => require(["@/view/sysmsg/sysmsg.vue"], resolve),
            },
            {
                path: 'banner',
                meta: {icon: 'ios-square-outline', title: '横幅配置', access: ['platform:banner']},
                name: 'platform_banner',
                component: resolve => require(["@/view/banner/banner.vue"], resolve),
            },
            {
                path: 'issue',
                meta: {icon: 'ios-text-outline', title: '工单管理', access: ['platform:issue']},
                name: 'platform_issue',
                component: resolve => require(["@/view/issue/issue.vue"], resolve),
            }
        ]
    },
    {
        path: '/user',
        name: 'user',
        component: Main,
        meta: {
            title: '用户管理',
            icon: 'md-person',
            showAlways: true
        },
        children: [
            {
                path: 'list',
                meta: {icon: 'ios-person-add-outline', title: '用户列表', access: ['user:list']},
                name: 'user_list',
                component: resolve => require(["@/view/user"], resolve),
            },
            {
                path: 'chook/list',
                meta: {icon: 'ios-apps-outline', title: '用户的鸡', access: ['user:chook:list']},
                name: 'user_chook_list',
                component: resolve => require(["@/view/user/chook.vue"], resolve),
            }
        ]
    },
    {
        path: '/team',
        name: 'team',
        component: Main,
        meta: {
            title: '团队管理',
            icon: 'ios-people',
            showAlways: true
        },
        children: [
            {
                path: 'user/list',
                meta: {icon: 'ios-contacts-outline', title: '团队用户', access: ['team:user:list']},
                name: 'team_user_list',
                component: resolve => require(["@/view/team/team-user.vue"], resolve),
            }
        ]
    },
    {
        path: '/chook',
        name: 'chook',
        component: Main,
        meta: {
            title: '柚子鸡管理',
            icon: 'ios-bonfire'
        },
        children: [
            {
                path: 'cls/list',
                meta: {icon: 'md-ionic', title: '柚子鸡列表', access: ['chook:cls:list']},
                name: 'chook_cls_list',
                component: resolve => require(["@/view/chook/chook-cls.vue"], resolve),
            },
            {
                path: 'market/list',
                meta: {icon: 'ios-globe-outline', title: '集市列表', access: ['chook:market:list']},
                name: 'chook_market_list',
                component: resolve => require(["@/view/chook/market.vue"], resolve),
            }
        ]
    },
    {
        path: '/trade',
        name: 'trade',
        component: Main,
        meta: {
            title: '交易管理',
            icon: 'md-git-compare',
            showAlways: true
        },
        children: [
            {
                path: 'list',
                meta: {icon: 'ios-recording-outline', title: '交易列表', access: ['trade:list']},
                name: 'trade_list',
                component: resolve => require(["@/view/trade/trade-list.vue"], resolve),
            },
            {
                path: 'subscribe/list',
                meta: {icon: 'ios-contract', title: '预约列表', access: ['trade:subscribe:list']},
                name: 'trade_subscribe_list',
                component: resolve => require(["@/view/trade/subscribe.vue"], resolve),
            },
            {
                path: 'transfer/wait/list',
                meta: {icon: 'ios-cart-outline', title: '待转让列表', access: ['trade:transfer:wait:list']},
                name: 'trade_transfer_wait_list',
                component: resolve => require(["@/view/trade/transfer-wait.vue"], resolve),
            }
        ]
    },
    {
        path: '/account',
        name: 'account',
        component: Main,
        meta: {
            title: '账户管理',
            icon: 'md-card',
            showAlways: true
        },
        children: [
            {
                path: 'millet-detail/list',
                meta: {icon: 'md-checkmark', title: '小米充值审核', access: ['account:milletdetail:list']},
                name: 'account_milletdetail_list',
                component: resolve => require(["@/view/account/millet-detail.vue"], resolve),
            }
        ]
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: resolve => require(["@/view/error-page/401.vue"], resolve),
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: resolve => require(["@/view/error-page/500.vue"], resolve),
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: resolve => require(["@/view/error-page/404.vue"], resolve),
    }
]
