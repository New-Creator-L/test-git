<template>
  <div>
    <!-- inline：让表单域成为行内的表单域，即一行可以放置多个行内元素
      el-form中的model属性在表单验证时必须写，因为验证的字段prop必须写model中的字段，否则验证就会不成功------除开验证之外model是否写不影响
    -->
      <el-form :inline="true" class="demo-form-inline" :model="cForm">
        <el-form-item label="一级分类"  style="margin-right:30px;margin-top:10px">
          <!-- 因为要收集下拉框的数据，因此必须要用v-model收集数据，没加v-model控制台会报错
                placeholder:默认文字
           -->
          <el-select placeholder="请选择" v-model="cForm.category1id" @change="handler1" :disabled='isShow'>
            <el-option :label="item.name" :value="item.id" v-for="item in categoryList1" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" style="margin-right:25px;margin-top:10px">
          <el-select v-model="cForm.category2id" placeholder="请选择"  @change="handler2" :disabled='isShow'> 
            <el-option :label="item.name" :value="item.id" v-for="item in categoryList2" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" style="margin-top:10px">
          <el-select v-model="cForm.category3id" placeholder="请选择" @change="handler3" :disabled='isShow'>
            <el-option :label="item.name" :value="item.id" v-for="item in categoryList3" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    name:'CategorySelect',
    data() {
      return {
        categoryList1:[],//一级分类的数据
        categoryList2:[],//二级分类的数据
        categoryList3:[],//三级分类的数据
        cForm:{//收集商品对应的id，因为二级和三级的数据需要一级和二级商品的id
          category1id:'',
          category2id:'',
          category3id:''
        },
      }
    },
    // 如果是添加或修改，则三级联动就无法使用
    props:['isShow'],
    mounted(){
      this.getList1Info()//挂载之后就获取一级分类的数据新进展示
    },
    methods:{
      //获取一级分类的数据
      async getList1Info(){
        let result =await this.$API.attr.reqCategoryList1();
        if(result.code==200){
          this.categoryList1=result.data
        }else{
          this.$message({
            type:'error',
            message:'一级分类数据获取失败'
          })
        }
      },
      //获取二级分类的数据
      async handler1(){
        // 当一级分类的数据发生改变时，二级和三级的之前的数据都应该清空
        this.categoryList2=[]
        this.categoryList3=[]
        // 清空id是因为id对应的name值会显示在select中，如果不删除，select中显示的依旧是之前的值
        this.cForm.category2id=''
        this.cForm.category3id=''
        let result=await this.$API.attr.reqCategoryList2(this.cForm.category1id)
        if(result.code==200){
          this.categoryList2=result.data
        }else{
          this.$message({
            type:'error',
            message:'二级分类数据获取失败'
          })
        }
        //每一次分类数据变化时都调用handler3触发自定义事件，将新的id传给父组件
        this.handler3()
      },
      //获取三级分类的数据
      async handler2(){
        // 当二级分类数据改变三级分类之前的数据清空
        this.categoryList3=[]
        this.cForm.category3id=''
        let result = await this.$API.attr.reqCategoryList3(this.cForm.category2id)
        if(result.code==200){
          this.categoryList3=result.data
        }else{
          this.$message({
            type:'error',
            message:'三级分类数据获取失败'
          })
        }
        this.handler3()
      },
      //三级分类数据改变时将一，二，三级id传给父组件
      handler3(){
        //结构出一，二，三级商品的id
        const {category1id,category2id,category3id}=this.cForm
        //触发自定义事件，传商品id
        this.$emit('getCategoryId',{category1id,category2id,category3id})
      }
    },
}
</script>

<style>

</style>