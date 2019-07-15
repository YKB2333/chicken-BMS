<template>
    <div>
        <Upload :headers="headers" :action=actionUrl :with-credentials=true
                :on-success="handleSuccess">
            <template v-if="imgSrc">
                <img :src="imgUrl" width="150px" height="100px">
            </template>
            <template v-else>
                <Button icon="ios-cloud-upload-outline">上传图片</Button>
            </template>
        </Upload>
    </div>
</template>


<script>

    export default {
        name: "upload-img",
        props: {
            src: {
                type: String,
                default: ""
            },
        },
        data() {
            return {
                actionUrl: this.baseUrl + "/system/fdfs/upload/image",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': localStorage.getItem('csrf-token')
                },
                imgUrl: this.baseImgUrl + this.imgSrc,
                imgSrc: this.src,
                credentials: true
            }
        },
        watch: {
            imgSrc(value) {
                this.$emit('changeSrc', value)
            },
            src(value) {
                this.imgSrc = value;
                this.imgUrl = this.baseImgUrl + this.imgSrc;
            }
        },
        methods: {
            handleSuccess(res, file) {
                this.imgSrc = res.data.filePath;
                this.imgUrl = this.baseImgUrl + res.data.filePath;
            }
        }
    }
</script>
