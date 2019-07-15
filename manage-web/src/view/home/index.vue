<template>
  <div>
    <Header />
    <div id="main">
      <div class="container">
        <Menu />
        <div id="dataBox">
          <div class="clearfix" style="margin-bottom:80px;">
            <div class="localRankings fl">
              <h2 style="padding-left:50px;">地市服务访问排名</h2>
              <ul>
                <li>
                  <span class="c1">01</span>
                  <span>长沙市</span>
                  <span class="fr">13次</span>
                </li>
                <li>
                  <span class="c2">02</span>
                  <span>长沙市</span>
                  <span class="fr">13</span>
                </li>
                <li>
                  <span class="c3">03</span>
                  <span>长沙市</span>
                  <span class="fr">13</span>
                </li>
                <li>
                  <span class="c4">01</span>
                  <span>长沙市</span>
                  <span class="fr">13</span>
                </li>
                <li>
                  <span class="c4">02</span>
                  <span>长沙市</span>
                  <span class="fr">13</span>
                </li>
                <li>
                  <span class="c4">03</span>
                  <span>长沙市</span>
                  <span class="fr">13</span>
                </li>
              </ul>
            </div>
            <div class="res_ser fl">
              <h2>资源与服务总数</h2>
              <div class="f1" v-for="item in res_ser">
                <div class="clearfix">
                  <ul class="fl_r fl clearfix">
                    <li>4</li>
                    <li>4</li>
                  </ul>
                  <ul class="fl_n fr clearfix">
                    <li>4</li>
                    <li>4</li>
                    <li>4</li>
                    <li>4</li>
                    <li>4</li>
                  </ul>
                </div>
                <div>
                  <span>{{item.type}}</span>
                  <span>{{item.num}}</span>
                </div>
              </div>
            </div>
            <div class="serviceRankings fl">
              <h2>服务访问排名</h2>
              <ul>
                <li>
                  <span>01</span>
                  <span>长沙市</span>
                  <span class="c5 fr">13</span>
                </li>
                <li>
                  <span>02</span>
                  <span>长沙市</span>
                  <span class="c5 fr">13</span>
                </li>
                <li>
                  <span>03</span>
                  <span>长沙市</span>
                  <span class="c6 fr">13</span>
                </li>
                <li>
                  <span>01</span>
                  <span>长沙市</span>
                  <span>13</span>
                </li>
                <li>
                  <span>02</span>
                  <span>长沙市</span>
                  <span>13</span>
                </li>
                <li>
                  <span>03</span>
                  <span>长沙市</span>
                  <span>13</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="clearfix">
            <div class="subLayer fl">
              <h2>图层采集空间率</h2>
              <ul>
                <li>
                  <div class="element1">
                    <div class="child1"></div>
                  </div>
                  <span class="c1">1</span>
                  <div class="circleBox">
                    <i-circle
                      :percent="80"
                      :size="40"
                      :stroke-width="14"
                      :trail-width="6"
                      :stroke-color="cirColor[0].h"
                      :trail-color="cirColor[0].l"
                      style="vertical-align:middle;"
                    >
                      <span
                        class="demo-Circle-inner"
                        style="font-size:10px;font-weight:bold;color:#1dff77;line-height:40px;"
                      >80%</span>
                    </i-circle>
                  </div>
                  <!-- <span>长沙市</span> -->
                  <span>治安/78960</span>
                </li>
                <li>
                  <div class="element2">
                    <div class="child2"></div>
                  </div>
                  <span class="c2">2</span>
                  <span>长沙市</span>
                  <span>13</span>
                </li>
                <li>
                  <div class="element3">
                    <div class="child3"></div>
                  </div>
                  <span class="c3">3</span>
                  <span>长沙市</span>
                  <span>13</span>
                </li>
                <li>
                  <div class="element4">
                    <div class="child4"></div>
                  </div>
                  <span>4</span>
                  <span>长沙市</span>
                  <span>13</span>
                </li>
              </ul>
            </div>
            <div class="res_trend fl">
              <h2>资源增量趋势</h2>
              <Statistics :id="'c1'" />
            </div>
            <div class="serviceFrequency fl">
              <h2>服务访问频次</h2>
              <div class="serviceNum">
                <div class="fl sl"></div>
                <div class="sc">
                  <i v-for="item in 4" class="iconfont iconicon-test"></i>
                </div>
                <div class="fr sr"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/rs_header/rs_header";
import Menu from "../../components/rs_menu/rs_menu";
import Statistics from "./G2Line";
export default {
  components: {
    Header,
    Menu,
    Statistics
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
#dataBox {
  overflow: hidden;
  display: inline-block;
  margin-left: 44px;
  margin-top: 60px;
  h2 {
    padding-left: 26px;
    font-size: 20px;
    font-weight: bold;
    color: #c0e5ff;
    letter-spacing: 4px;
    text-align: center;
    line-height: 42px;
  }
  .localRankings,
  .serviceRankings {
    width: 250px;
    height: 298px;
    background: url("../../assets/images/hnimages/rankings.png");
    background-size: cover;
    ul {
      margin-top: 12px;
      margin-left: 23px;
      width: 215px;
      height: 218px;
      // background:red;
      li {
        margin-bottom: 8px;
        span {
          vertical-align: middle;
          &:nth-child(1) {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            margin-right: 16px;
          }
          &:nth-child(2) {
            font-size: 16px;
            color: #ffffff;
            // margin-right: 69px;
          }
          &:nth-child(3) {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
          }
          &.c1 {
            color: #1dff77;
          }
          &.c2 {
            color: #83ffc6;
          }
          &.c3 {
            color: #09ffff;
          }
          &.c4,
          &.c1,
          &.c2,
          &.c3 {
            &::before {
              content: "";
              display: inline-block;
              width: 22px;
              height: 22px;
              margin-right: 9px;
              vertical-align: middle;
            }
          }
          &.c1,
          &.c2,
          &.c3 {
            &::before {
              content: url(../../assets/images/hnimages/medal.png);
            }
          }
          &.c5,
          &.c6 {
            &::after {
              content: url(../../assets/images/hnimages/upArrow.png);
              display: inline-block;
              width: 20px;
              height: 20px;
              vertical-align: text-top;
            }
          }
          &.c6::after {
            content: url(../../assets/images/hnimages/downArrow.png);
          }
        }
      }
    }
  }
  .res_ser {
    margin: 0 35px 0 35px;
  }
  .res_trend {
    margin: 0 27px 0 27px;
  }
  .res_ser,
  .res_trend {
    h2 {
      width: 480px;
      height: 32px;
      margin-top: 6px;
      margin-bottom: 23px;
      line-height: 32px;
      padding: 0;
      background: url("../../assets/images/hnimages/res_ser.png") center
        no-repeat;
      background-size: 102% 130%;
    }
    ul {
      li {
        float: left;
        width: 52px;
        height: 73px;
        margin: 0 7px 18px 0;
        border-radius: 4px;
        border: 1px solid #a3f6f8;
        font-size: 48px;
        font-weight: bold;
        text-align: center;
      }
      &.fl_r {
        color: #1dff77;
      }
      &.fl_n {
        color: #09ffff;
        li:last-child {
          margin-right: 0;
        }
      }
    }
    .f1 {
      margin-bottom: 16px;
    }
    span {
      padding-right: 144px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
    }
  }
  .serviceRankings {
    background: url("../../assets/images/hnimages/rankings_reverse.png");
    background-size: cover;
  }
  .subLayer,
  .serviceFrequency {
    width: 258px;
    height: 248px;
    background: url("../../assets/images/hnimages/subLayer.png") no-repeat;
    background-size: 100% 100%;
  }
  .subLayer {
    ul {
      margin-top: 22px;
      margin-left: 23px;
      width: 215px;
      height: 218px;
      // background:red;
      li {
        margin-bottom: 8px;
        .element1,
        .element2,
        .element3,
        .element4 {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-right: 15px;
          border: 1px solid #1dff77;
          border-radius: 50%;
          vertical-align: middle;
          .child1,
          .child2,
          .child3 {
            width: 11px;
            height: 11px;
            margin: 0.8px 0 0 1.2px;
            border: 1px solid #1dff77;
            border-radius: 50%;
          }
        }
        .element2,
        .child2 {
          border-color: #83ffc6;
        }
        .element3,
        .child3 {
          border-color: #09ffff;
        }
        .element4,
        .child4 {
          border-color: transparent;
        }
        span {
          vertical-align: middle;
          &:nth-child(2) {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            margin-right: 20px;
          }
          &.c1 {
            color: #1dff77;
          }
          &.c2 {
            color: #83ffc6;
          }
          &.c3 {
            color: #09ffff;
          }
          &:nth-child(4) {
            font-size: 16px;
            color: #fff;
          }
        }
        .circleBox {
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
  .serviceFrequency {
    margin-left: 5px;
    background: url("../../assets/images/hnimages/subLayer_reverse.png");
    background-size: 100% 100%;
    .serviceNum {
      margin: 39px auto;
      width: 153px;
      height: 125px;
      background: url("../../assets/images/hnimages/grid.png") center no-repeat;
      text-align: center;
      .sl,
      .sr {
        width: 12px;
        height: 125px;
        background: url("../../assets/images/hnimages/grid_l.png") center
          no-repeat;
      }
      .sr {
        background: url("../../assets/images/hnimages/grid_r.png") center
          no-repeat;
      }
      .sc {
        display: inline-block;
        line-height: 125px;
        padding-right: 6px;
        i {
          font-size: 32px;
          color: #a3f6f8;
          margin-right: -8px;
        }
      }
    }
  }
}
</style>

