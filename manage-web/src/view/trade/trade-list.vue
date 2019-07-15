<template>
    <div>
        <Card>
            <Tabs value="WAIT_PAY" @on-click="handleClickTab">
                <TabPane label="待付款" name="WAIT_PAY">
                    <TradeListShow type="WAIT_PAY"/>
                </TabPane>
                <TabPane label="待确认" name="UNCONFIRMED">
                    <TradeListShow type="UNCONFIRMED"/>
                </TabPane>
                <TabPane label="申诉" name="APPEAL">
                    <TradeListShow type="APPEAL"/>
                </TabPane>
                <TabPane label="失败" name="FAILURE">
                    <TradeListShow type="FAILURE"/>
                </TabPane>
                <TabPane label="成功" name="SUCCESS">
                    <TradeListShow type="SUCCESS"/>
                </TabPane>
                <TabPane label="关闭(未支付)" name="CLOSE">
                    <TradeListShow type="CLOSE"/>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
    import TradeListShow from "./trade-list-show";
    import bus from "../../bus.js"

    export default {
        name: "trade-list",
        components: {TradeListShow},
        data() {
            return {}
        },
        created() {
        },
        methods: {
            handleClickTab(name) {
                bus.$emit('clickTradeListTab', name)
            }
        }
    }
</script>

<style scoped>

</style>
