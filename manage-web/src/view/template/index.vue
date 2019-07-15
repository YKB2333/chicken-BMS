<template>
  <div>
    <Card>
      <div class="template-search margin-bottom-10">
        <Row>
          <Col span="6">
            <label>模板KEY: </label>
            <Input v-model="search.templateId" placeholder="模板KEY" style="width: 200px"/>
          </Col>
          <Col span="6">
            <Button type="success" icon="ios-search" @click="handleSearch">查询</Button>
            <Button type="info" icon="md-add" @click="handleCreate">新增</Button>
          </Col>
        </Row>
      </div>
      <div class="template-list">
        <Table border :loading="content.loading" :columns="content.columns" :data="content.data"></Table>
      </div>
    </Card>


    <!-- 新增修改 -->
    <Drawer
      :title="form.title"
      v-model="form.show"
      width="720"
      :mask-closable="false"
      :styles="styles">
      <Form :model="form.template" ref="formTemplate" :rules="form.ruleValidate" style="margin-right: 30px">
        <FormItem label="模板KEY: " label-position="left" :label-width="80" prop="templateId">
          <Input v-model="form.template.templateId" placeholder="请输入品牌名称" style="width: 300px" :disabled="!form.isAdd"/>
        </FormItem>
        <FormItem label="模板名称: " label-position="left" :label-width="80" prop="name">
          <Input v-model="form.template.name" placeholder="请输入品牌名称" style="width: 300px"/>
        </FormItem>
        <FormItem label="备注: " label-position="left" :label-width="80" prop="remark">
          <Input v-model="form.template.remark" placeholder="请输入品牌名称" style="width: 300px"/>
        </FormItem>
        <FormItem :label-width="80">
          <Button type="primary" style="margin-left: 30px" @click="handleSubmit('formTemplate')">提交</Button>
          <Button style="margin-left: 8px" @click="handleReset('formTemplate')">重置</Button>
        </FormItem>
      </Form>
    </Drawer>

  </div>
</template>

<script>
  import {get, post} from "../../libs/axios-cfg";

  export default {
    data() {
      var self = this;
      const validateTemplateId = async (rule, value, callback) => {
        if (!value) {
          return callback(new Error('模板KEY不能为空'))
        }
        if (!self.form.isAdd) {
          return
        }
        try {
          let res = await get('/api/mgm/templateinfo/one?templateId=' + value)
          if (res.data != null) {
            callback(new Error('模板KEY重复'))
          }
        } catch (error) {
          callback(error)
        }
      };
      return {
        search: {
          templateId: ''
        },
        content: {
          loading: false,
          data: [],
          columns: [
            {
              title: 'ID',
              key: 'id'
            },
            {
              title: '模板KEY',
              key: 'templateId'
            },
            {
              title: '模板名称',
              key: 'name'
            },
            {
              title: '创建时间',
              key: 'createTime',
              render: (h, params) => {
                return h('span', {}, new Date(params.row.createTime).toLocaleDateString())
              }
            },
            {
              title: '备注',
              key: 'remark'
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row)
                    }
                  }
                }, '修改')
              }
            }
          ]
        },
        form: {
          isAdd: true,
          show: false,
          template: {},
          ruleValidate: {
            templateId: [
              {validator: validateTemplateId, required: true, trigger: 'blur'}
            ],
            name: [
              {required: true, message: '模板名称不能为空', trigger: 'blur'}
            ],
            remark: [
              {required: true, message: '备注不能为空', trigger: 'blur'}
            ]
          }
        },
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        }
      }
    },
    created() {
      this.handleSearch();
    },
    methods: {
      handleSearch() {
        this.queryTemplate()
      },
      handleCreate() {
        this.form.show = true;
        this.form.template = {};
        this.form.isAdd = true
      },
      handleEdit(row) {
        this.form.isAdd = false;
        this.form.title = '更新模板';
        this.form.template = row;
        this.form.show = true;
      },
      handleSubmit(name) {
        var self = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (self.form.isAdd) {
              this.createTemplate()
            } else {
              this.updateTemplate()
            }
            this.form.show = false;
            this.queryTemplate()
          } else {
            this.$Message.error('验证不通过!')
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      async queryTemplate() {
        this.content.loading = true;
        try {
          let res = await post('/api/mgm/templateinfo/list', this.search);
          this.content.data = res.data.records;
        } catch (error) {
          this.$throw(error);
        }
        this.content.loading = false;
      },
      async createTemplate() {
        try {
          let res = await post('/api/mgm/templateinfo/add', this.form.template);
          if (res.status === 1) {
            this.$Message.success('新增成功');
            this.queryTemplate()
          }
        } catch (error) {
          this.$throw(error)
        }
      },
      async updateTemplate() {
        try {
          let res = await post('/api/mgm/templateinfo/update/' + this.form.template.id, this.form.template);
          if (res.status === 1) {
            this.$Message.success('更新成功');
            this.queryTemplate()
          }
        } catch (error) {
          this.$throw(error)
        }
      }
    }
  }
</script>

<style scoped>

</style>
