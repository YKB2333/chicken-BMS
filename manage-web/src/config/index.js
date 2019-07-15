export default {
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        dev: 'http://127.0.0.1:8901',
        pro: 'http://47.105.107.213:9031'
    },
    baseImgUrl: {
        dev: 'http://47.93.85.1:8089/',
        pro: 'http://47.93.85.1:8089/'
    }
}
