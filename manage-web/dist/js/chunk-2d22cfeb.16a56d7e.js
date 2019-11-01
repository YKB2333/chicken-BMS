(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d22cfeb"],{f638:function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("Card",[a("p",{staticClass:"card-title",attrs:{slot:"title"},slot:"title"},[a("Icon",{attrs:{type:"home"}}),a("span",[e._v("角色管理")])],1),a("div",[[a("Row",[a("Col",{attrs:{span:"15"}},[a("Button",{attrs:{type:"info"},on:{click:function(t){return e.openAddOrUpModal(null)}}},[a("Icon",{attrs:{type:"md-add"}}),e._v(" 添加角色")],1),a("Button",{attrs:{disabled:e.setting.loading,type:"success"},on:{click:e.getData}},[a("Icon",{attrs:{type:"md-refresh"}}),e._v(" 刷新数据")],1),a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.exportData(1)}}},[a("Icon",{attrs:{type:"ios-download-outline"}}),e._v(" 导出表格")],1)],1),a("Col",{attrs:{span:"9"}},[a("Input",{staticClass:"margin-bottom-10",attrs:{placeholder:"请输入您想要搜索的内容..."},model:{value:e.search.value,callback:function(t){e.$set(e.search,"value",t)},expression:"search.value"}},[a("Button",{attrs:{slot:"append",icon:"ios-search"},slot:"append"})],1)],1)],1),a("Table",{ref:"table",staticClass:"margin-bottom-10",attrs:{columns:e.columns,loading:e.setting.loading,border:e.setting.showBorder,data:e.data.records}}),a("Page",{staticClass:"tr",attrs:{total:e.data.total,current:e.data.current,"page-size":e.data.size,"show-elevator":"","show-sizer":""},on:{"on-change":e.pageChange,"update:current":function(t){return e.$set(e.data,"current",t)},"on-page-size-change":e.pageSizeChange}})]],2)]),e.addRoleModal?a("AddRole",{attrs:{"all-resource":e.allResource},on:{cancel:e.onAddRoleModalCancel}}):e._e(),e.updateRoleModal?a("UpdateRole",{attrs:{"all-resource":e.allResource,"update-object":e.updateObject},on:{cancel:e.onUpdateRoleModalCancel}}):e._e(),a("Modal",{attrs:{width:"360"},model:{value:e.removeModal,callback:function(t){e.removeModal=t},expression:"removeModal"}},[a("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"information-circled"}}),a("span",[e._v("提示")])],1),a("div",{staticStyle:{"text-align":"center"}},[a("p",[e._v("此操作为不可逆操作，是否确认删除？")])]),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large",long:"",loading:e.setting.loading},on:{click:e.remove}},[e._v("确认删除")])],1)])],1)},s=[],o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("Modal",{attrs:{title:"角色添加",loading:e.loading,"mask-closable":!1,width:800,closable:!1},model:{value:e.showModal,callback:function(t){e.showModal=t},expression:"showModal"}},[a("Form",{ref:"addrole",attrs:{model:e.formItem,"label-width":90,rules:e.ruleValidate}},[a("FormItem",{attrs:{label:"角色名称：",prop:"name"}},[a("Input",{attrs:{placeholder:"角色名称"},model:{value:e.formItem.name,callback:function(t){e.$set(e.formItem,"name",t)},expression:"formItem.name"}})],1)],1),a("Form",{attrs:{"label-width":70}},[a("FormItem",{attrs:{label:"权限集：",prop:"permissions"}},[a("Tree",{ref:"tree",attrs:{data:e.formItem.permissions,"show-checkbox":""}})],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"default",disabled:e.loading},on:{click:function(t){return e.cancel(!1)}}},[e._v("取消")]),a("Button",{attrs:{type:"primary",loading:e.loading},on:{click:e.ok}},[e._v("确定")])],1)],1)],1)},r=[],i=a("d689"),n={data(){return{formItem:{name:"",permissions:[]},showModal:!0,loading:!1,ruleValidate:{name:[{required:!0,message:"角色名称不能为空"}]}}},props:{allResource:{type:Array}},created(){this.getAllResource()},methods:{cancel(e=!1){this.$emit("cancel",e)},ok(){let e=this.$refs.tree.getCheckedNodes();this.$refs.addrole.validate(t=>{if(t)if(e.length<1)this.$Notice.destroy(),this.$Notice.warning({title:"请至少选择一个权限资源",duration:2});else{let t={name:this.formItem.name,resources:e};this.add(t)}})},async add(e){this.loading=!0;try{await Object(i["b"])("/system/role/add",e);this.$Message.success("角色 "+e.name+" 添加成功"),this.cancel(!0)}catch(t){this.$throw(t)}this.loading=!1},async getAllResource(){let e=JSON.parse(JSON.stringify(this.allResource));this.dealPostData(e),this.formItem.permissions=e},dealPostData(e){e.forEach(e=>{e.title=e.name,null!=e.children&&this.dealPostData(e.children)})}}},d=n,c=a("2877"),h=Object(c["a"])(d,o,r,!1,null,null,null),u=h.exports,p=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("Modal",{attrs:{title:"更新角色",loading:e.loading,"mask-closable":!1,width:800,closable:!1},model:{value:e.showModal,callback:function(t){e.showModal=t},expression:"showModal"}},[a("Form",{ref:"updateRole",attrs:{model:e.formItem,"label-width":90,rules:e.ruleValidate}},[a("FormItem",{attrs:{label:"角色名称：",prop:"name"}},[a("Input",{attrs:{placeholder:"角色名称"},model:{value:e.formItem.name,callback:function(t){e.$set(e.formItem,"name",t)},expression:"formItem.name"}})],1)],1),a("Form",{attrs:{"label-width":70}},[a("FormItem",{attrs:{label:"权限集：",prop:"permissions"}},[a("Tree",{ref:"tree",attrs:{data:e.formItem.permissions,"show-checkbox":""}})],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"default",disabled:e.loading},on:{click:function(t){return e.cancel(!1)}}},[e._v("取消")]),a("Button",{attrs:{type:"primary",loading:e.loading},on:{click:e.ok}},[e._v("确定")])],1)],1)],1)},m=[],g={data(){return{formItem:{name:"",permissions:[]},showModal:!0,loading:!1,ruleValidate:{name:[{required:!0,message:"角色名称不能为空"}]}}},props:{updateObject:{type:Object,default:null},allResource:{type:Array}},created(){null!=this.updateObject&&(this.formItem.name=this.updateObject.name),this.getAllResource()},methods:{cancel(e=!1){this.$emit("cancel",e)},ok(){let e=this.$refs.tree.getCheckedNodes();this.$refs.updateRole.validate(t=>{if(t)if(e.length<1)this.$Notice.destroy(),this.$Notice.warning({title:"请至少选择一个权限资源",duration:2});else{let t={name:this.formItem.name,resources:e};this.update(t)}})},async update(e){this.loading=!0;try{await Object(i["b"])("/system/role/update/{id}",e,{id:this.updateObject.id});this.$Message.success("角色 "+e.name+" 更新成功"),this.cancel(!0)}catch(t){this.$throw(t)}this.loading=!1},async getAllResource(){let e=JSON.parse(JSON.stringify(this.allResource));this.dealPostData(e),this.formItem.permissions=e},permissionSync(e,t){null!=e&&e.length>0&&e.forEach(a=>{a.id==t.id&&(t.checked=!0),null!=a.children&&a.children.length>0&&permissionSync(e,t)})},dealPostData(e){e.forEach(e=>{e.title=e.name,this.permissionSync(this.updateObject.resources,e),null!=e.children&&this.dealPostData(e.children)})}}},f=g,b=Object(c["a"])(f,p,m,!1,null,null,null),y=b.exports,v={data(){return{addRoleModal:!1,updateRoleModal:!1,updateObject:null,removeModal:!1,setting:{loading:!0,showBorder:!0},search:{type:"name",value:""},columns:[{title:"ID",key:"id",sortable:!0},{title:"角色名",key:"name",sortable:!0},{title:"操作",key:"action",width:260,align:"center",render:(e,t)=>{return e("div",[e("Button",{props:{type:"success",size:"small"},style:{marginRight:"5px"},on:{click:()=>{this.showAllResource(t.row)}}},"查看权限集"),e("Button",{props:{type:"primary",size:"small"},style:{marginRight:"5px"},on:{click:()=>{this.openAddOrUpModal(t.row)}}},"修改信息"),e("Button",{props:{type:"error",size:"small"},on:{click:()=>{this.removeObject={obj:t.row,index:t.index},this.removeModal=!0}}},"删除")])}}],data:{},dataFilter:{page:1,pageSize:10},removeObject:null,allResource:null}},components:{AddRole:u,UpdateRole:y},created(){this.getData()},methods:{pageChange(e){this.dataFilter.page=e,this.getData()},pageSizeChange(e){this.dataFilter.pageSize=e,this.getData()},async getAllResource(){try{let t=await Object(i["b"])("/system/resource/list");this.allResource=t.data}catch(e){this.$throw(e)}},async remove(){if(this.removeModal=!1,null==this.removeObject)return this.$Message.warning("删除对象为空，无法继续执行！"),!1;this.setting.loading=!0;try{await Object(i["b"])("/system/role/remove/{rid}",null,{rid:this.removeObject.obj.id});this.$Message.success("删除成功"),this.data.records.splice(this.removeObject.index,1)}catch(e){this.$throw(e)}this.setting.loading=!1},async getData(){this.setting.loading=!0;try{let t=await Object(i["b"])("/system/role/list",{page:this.dataFilter.page,pageSize:this.dataFilter.pageSize});this.data=t.data}catch(e){this.$throw(e)}this.setting.loading=!1},async openAddOrUpModal(e,t="update"){null===this.allResource&&await this.getAllResource(),null===e?this.addRoleModal=!0:"update"===t&&(this.updateObject=e,this.updateRoleModal=!0)},onAddRoleModalCancel(e=!1){this.addRoleModal=!1,e&&this.getData()},onUpdateRoleModalCancel(e=!1){this.updateRoleModal=!1,e&&this.getData()},dealPostData(e,t,a){null!=e&&e.forEach(e=>{let l=a("Tag",{props:{color:"green",type:"dot"}},e.name);t.push(l),null!=e.children&&this.dealPostData(e.children,t,a)})},showAllResource(e){let t=e.resources;null!=t&&"object"==typeof t&&t.length>0?this.$Modal.info({title:e.name+" - 权限集",width:"40%",render:e=>{let a=[];return t.forEach(t=>{let l=e("Tag",{props:{color:""==t.color?"green":t.color,type:"dot"}},t.name);a.push(l),this.dealPostData(t.children,a,e)}),e("div",{style:{padding:"20px 0 10px 0"}},a)}}):(this.$Notice.destroy(),this.$Notice.info({title:"该角色暂无权限信息",duration:3}))},exportData(e){1===e&&this.$refs.table.exportCsv({filename:"权限数据-"+(new Date).getTime(),columns:this.columns.filter((e,t)=>t>1&&t<this.columns.length-1),data:this.data})}}},w=v,R=Object(c["a"])(w,l,s,!1,null,null,null);t["default"]=R.exports}}]);