<template>
  <div>
    <template v-if="fileSrc">
      <Button icon="md-arrow-down" @click="downloadFile">下载文件</Button>
    </template>
    <Upload :headers="headers" :action=actionUrl :with-credentials=true
            :on-success="handleSuccess" style="display: inline-flex">
      <Button icon="ios-cloud-upload-outline">上传文件</Button>
    </Upload>
  </div>
</template>

<script>
  import config from '../../../../config/index'

  export default {
    name: "upload-download",
    props: {
      src: {
        type: String,
        default: ""
      },
      action: {
        type: String,
        default: ""
      }
    },
    data() {
      const baseRequestUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
      return {
        baseRequestUrl: baseRequestUrl,
        actionUrl: baseRequestUrl + this.action,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Authorization': localStorage.getItem('csrf-token')
        },
        fileUrl: this.baseRequestUrl + "/system/upload/download?fileSrc=" + this.fileSrc,
        fileSrc: this.src,
        credentials: true
      }
    },
    watch: {
      fileSrc(value) {
        this.$emit('changeFileSrc', value)
      },
      src(value) {
        this.fileSrc = value;
        this.fileUrl = this.baseRequestUrl + "/system/upload/download?fileSrc=" + this.fileSrc;
      }
    },
    methods: {
      handleSuccess(res, file) {
        this.fileSrc = res.data;
        this.fileUrl = this.baseRequestUrl + "/system/upload/download?fileSrc=" + res.data;
      },
      downloadFile() {
        window.open(this.fileUrl, '_blank');
      }
    }
  }
</script>

<style scoped>

</style>
