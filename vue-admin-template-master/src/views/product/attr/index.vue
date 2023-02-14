<template>
  <div>
      <el-card style="margin-bottom:20px">
          <!-- 子组件绑定自定义事件，从子组件传商品的id给父组件 -->
          <!-- isShow用于决定三级联动是否能用 -->
          <CategorySelect @getCategoryId="getCategoryId" :isShow='!isShow'/>
      </el-card>
      <el-card>
          <div v-show="isShow">
              <!-- :disabled='!category3id':当三级分类没有选定数据项时此属性被禁用 -->
            <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled='!category3id'>添加属性</el-button>
            <el-table style="width: 100%;margin:10px 0px" border="" :data="List">
                <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                <el-table-column prop="attrName" label="属性名称" width="150px"></el-table-column>
                <el-table-column label="属性值列表" width="width">
                    <template slot-scope="{row}">
                        <el-tag type="success" v-for="item in row.attrValueList" :key="item.id" style="margin-left:15px">{{item.valueName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="{row}">
                        <el-button type="warning" icon="el-icon-delete" size="mini" @click="editorAttr(row)">修改</el-button>
                        <el-button type="danger" icon="el-icon-edit" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          </div>
          <!-- 添加或者修改属性的结构 -->
          <div v-show="!isShow">
              <el-form ref="form" label-width="80px" :inline='true'>
                  <el-form-item label="属性名">
                      <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                  </el-form-item>
              </el-form>
              <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled='!attrInfo.attrName'>添加属性</el-button>
              <el-button @click="isShow=true">取消</el-button>
              <!-- 这里必须要写data，不然作用域插槽的row就无法获取attrValueList中的数据 -->
              <el-table style="width: 100%;margin:20px 0px" border="" :data="attrInfo.attrValueList">
                  <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
                  <el-table-column  label="属性值名称" width="width">
                      <!-- 这里的row是attrValueList中的每一个元素,因为el-table中的data绑定的是attrInfo.attrValueList -->
                      <template slot-scope="{row}">
                          <!-- el-input和el-span两种结构用于编辑和展示 -->
                          <!-- @blur="flag=false" @keyup.native.enter="flag=false"-----input框失去焦点和按下回车时展示span标签 -->
                          <!-- 注：v-if和v-else之间不允许出现任何结点，否则失效 -->
                          <el-input ref="showinput" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="ChangeShow(row)"  @keyup.native.enter="ChangeShow(row)"></el-input>
                          <span v-else @click="revise(row)" style="display:block">{{row.valueName}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column  label="操作" width="width">
                      <template slot-scope="{row,$index}">
                            <!-- <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteInfo(row)"></el-button> -->
                          <!-- popconfirm---气泡确认框
                               confirm---点击弹出框的确认时触发(但是这个模板引用的是老版的element，故触发事件为onConfirm)     cancel-----点击取消时触发
                           -->
                          <el-popconfirm :title="`确定要删除${row.valueName}`" @onConfirm="deleteAttr($index)">
                             <!-- slot="reference"-----点击之后弹出提示框 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                          </el-popconfirm>
                      </template>
                  </el-table-column>
              </el-table>
              <!-- :disabled='attrInfo.attrValueList.length<0'-----还没添加属性时，保存按钮无法使用 -->
              <el-button type="primary" @click="saveInfo" :disabled='attrInfo.attrValueList.length<0'>保存</el-button>
              <el-button @click="isShow=true">取消</el-button>
          </div>
      </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
    name:"attr",
    data() {
        return {
            category1id:'',
            category2id:'',
            category3id:'',
            List:[],
            isShow:true,//控制div切换展示
            attrInfo:{//收集添加||修改的属性信息，也就是要传给服务器的参数
                attrName: "",//属性名
                attrValueList: [],//属性值，因为属性值可以有多个，因此是一个数组
                categoryId: '',//携带的都是三级分类的商品id
                categoryLevel: 3,//因为服务器也需要区分是几级分类，故要带此参数，而传过去的都是三级分类
                id:''//商品属性的id
            }
        }
    },
    methods:{
        // 自定义事件获取三级分类的id
        getCategoryId(data){
            //结构出子组件传递的商品id
           const {category1id,category2id,category3id}=data
           this.category1id=category1id
           this.category2id=category2id
           this.category3id=category3id
           if(this.category3id!=''){
               this .getAttrList()
           }
        },
        // 根据id获取对应的商品信息
        async getAttrList(){
            let result= await this.$API.attr.reqAttrListInfo(this.category1id,this.category2id,this.category3id)
            if(result.code==200){
                    this.List=result.data
                }else{
                    this.$message({
                        type:'error',
                        message:"数据获取失败"
                    })
                }
        },
        // 保存添加或修改的属性
        async saveInfo(){
            // 过滤掉添加的空属性
            this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
                if(item.valueName!=''){
                    // 删除flage属性，因为服务器不需要flag属性，而每次添加或修改属性的时候都会再添加一个flage属性，所以能实现对属性值的编辑操作
                    delete item.flag
                    return true
                }
            })
            try {
                await this.$API.attr.reqAddOrEditorAttr(this.attrInfo)
                // 保存之后跳转到属性展示页面
                this.isShow=true
                this.$message({type:'success',message:'数据保存成功'})
                // 重新获取数据
                this.getAttrList()
            } catch (error) {
                this.$message({type:'error',message:'数据保存失败'})
            }
        },
        // 添加商品属性跳转
        addAttr(){
            this.isShow=false
            this.attrInfo.categoryId=this.category3id
            // 清空之前的数据
            this.attrInfo.attrValueList=[]
            this.attrInfo.attrName=''
        },
        // 添加商品的属性值
        addAttrValue(){
            // 每增加一个属性，就在数组里用push追加一个对象
            this.attrInfo.attrValueList.push({
                // 表明是对哪一个商品进行添加属性
                 attrId: this.attrInfo.id,//如果this.attrInfo.id为空代表新增，反之为修改
                 valueName:'',
                 flag:true//用于控制编辑和展示的切换，并且每一个属性值都有一个独立的flag用于控制切换
            })
            // 输入框自动获取焦点，但是注意异步的问题，也就是虽然点击了添加，但是页面还没有更新，还无法获取到元素
            this.$nextTick(()=>{
                this.$refs.showinput.focus()
            })
        },
        // 修改商品属性
        editorAttr(data){
            this.isShow=false
            // 利用lodash的深拷贝
            this.attrInfo=cloneDeep(data)
            // 点击编辑跳转之后，给每一个属性都动态添加一个flag属性，用于控制能否修改已经存在的属性值
            this.attrInfo.attrValueList.forEach(item=>{
                this.$set(item,'flag',false)
            })
        },
        //添加的属性值的编辑和展示
        ChangeShow(data){
            // 判断是否为空
            if(data.valueName.trim()==''){
                this.$message({
                    type:'warning',
                    message:'您添加了一个空属性'
                })
                return;
            }
            // 判断是否有重复的属性值
            let isReapter=this.attrInfo.attrValueList.some(item=>{
                if(data!=item){
                    return data.valueName==item.valueName
                }
            })
            if(isReapter){
                this.$message({
                    type:'error',
                    message:'添加的属性已存在'
                })
                return;
            }else{
                // 这里能改flag的值，是因为这里的data和对应的属性指向的是同一个地址
                data.flag=false
            }
        },
        // 修改正在添加的属性
        revise(data){
            data.flag=true
            this.$nextTick(()=>{
                this.$refs.showinput.focus()
            })
        },
        // 删除属性值
        deleteAttr(index){
            // 方法一:用filter过滤，然后将返回的数组替换掉data中的数据
            // 方法二:用splice根据索删除，会更改原数组的长度
            this.attrInfo.attrValueList.splice(index,1)//这里不发请求，只有点击保存时才发请求
        }
    },
}
</script>

<style>

</style>