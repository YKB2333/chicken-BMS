<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/rs_header/rs_header";
import Menu from "../../components/rs_menu/rs_menu";
export default {
  components: {
    Header,
    Menu,
    // Service, PageHeader
  },
  data() {
    return {
      res_ser: [
        {
          type: "资源类型",
          num: "记录条例"
        },
        {
          type: "服务类型",
          num: "访问次数"
        }
      ],
      cirColor: [
        {
          h: "rgb(29, 255, 119)",
          l: "rgb(29, 255, 119, .5)"
        },
        {
          h: "rgb(131, 255, 198)",
          l: "rgb(131, 255, 198, .5)"
        },
        {
          h: "rgb(9, 255, 255)",
          l: "rgb(9, 255, 255, .5)"
        },
        {
          h: "rgb(29, 255, 119)",
          l: "rgb(29, 255, 119, .5)"
        }
      ]
    };
  }
};
</script>
<style scoped lang="less">

</style>

