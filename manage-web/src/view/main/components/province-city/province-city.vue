<template>
  <div>
    <Select v-model="value.provinceId" style="width:150px;margin-right: 10px" placeholder="请选择省份"
            @on-change="changeProvince">
      <Option v-for="item in options.province" :value="item.id" :key="item.id">{{ item.name }}</Option>
    </Select>
    <Select v-model="value.cityId" style="width:150px" placeholder="请选择城市">
      <Option v-for="item in options.city" :value="item.id" :key="item.id">{{ item.name }}</Option>
    </Select>
  </div>
</template>

<script>
  import {get, post} from '../../../../libs/axios-cfg'

  export default {
    name: 'province-city',
    props: {
      provinceId: {
        type: String,
        default: null
      },
      cityId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        options: {
          province: [],
          city: []
        },
        value: {
          provinceId: this.provinceId,
          cityId: this.cityId
        }
      }
    },
    created() {
      this.queryProvince()
    },
    watch: {
      cityId(value, oldValue) {
        if (this.provinceId == null && value != null) {
          this.findProvinceByCityId(value)
        }
      },
      value: {
        handler(value, oldValue) {
          this.$emit('changeCity', value.cityId);
        },
        deep: true
      }
    },
    methods: {
      changeProvince() {
        this.queryCity()
      },
      async queryProvince() {
        try {
          let res = await post('/system/region/province/list', {})
          this.options.province = res.data.records
        } catch (error) {
          this.$throw(error)
        }
      },
      async queryCity() {
        if (this.value.provinceId == null) {
          return
        }
        try {
          let res = await post('system/region/city/list', {provinceId: this.value.provinceId})
          this.options.city = res.data.records
        } catch (error) {
          this.$throw(error)
        }
      },
      async findProvinceByCityId(cityId) {
        try {
          let res = await get('system/region/province/one?cityId=' + cityId)
          if (!res.data) {
            return
          }
          let province = res.data
          this.value.provinceId = province.id
          this.queryCity()
          this.value.cityId = cityId
        } catch (error) {
          this.$throw(error)
        }
      }
    }
  }
</script>

<style scoped>
</style>
