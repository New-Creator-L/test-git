<template>
  <div>
      <el-card style="margin-bottom:20px">
          <!-- 全集组件---三级分类联动 -->
          <!-- 通过screen的值控制三级联动，当为添加或者修改页面时，三级联动就无法使用 -->
          <CategorySelect @getCategoryId="getCategoryId"  :isShow='screen!=0'/>
      </el-card>
      <el-card>
          <div v-show="screen==0">
              <el-button type="primary" icon="el-icon-plus" @click="addOrEditSpu(1)" :disabled='!category3id'>添加spu</el-button>
              <el-table border  style="margin-top:15px" :data="spuList">
                <el-table-column label="序号" type="index" width="75px" align="center"></el-table-column>
                <el-table-column label="spu名称" prop="spuName"></el-table-column>
                <el-table-column label="spu描述" prop="description"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <!-- button的提示框可以用title属性 -->
                        <!-- hint-button----封装的一个全局组件按钮-->
                        <hint-Button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-Button>
                        <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="addOrEditSpu(1,row)"></hint-button>
                        <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="showSkuInfo(row)" ></hint-button>
                        <!-- el-popconfirm，点击删除时，弹出提示框 -->
                        <el-popconfirm title="确定删除吗？" @onConfirm='deleteAttr(row)'>
                            <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
              </el-table>
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="getSpuList"
                  style="text-align:center"
                  :current-page="page"
                  :page-sizes="[3, 5, 10]"
                  :page-size="limit"
                  layout="prev, pager, next, jumper,->,sizes,total"
                  :total="total">
              </el-pagination>
          </div>
          <spuForm v-show="screen==1" @changeScreen="changeScreen" ref="spuForm"/>
          <skuForm v-show="screen==2" ref="skuForm" @changeSku="changeSku" />
      </el-card>
      <!-- sku对话框
            :before-close="close"---是一个属性，但是绑定的是一个回调函数，对话框关闭前调用
       -->
      <el-dialog :title="`${skuTitle}的收货地址`" :visible.sync="dialogTableVisible" :before-close="close">
          <!-- v-loading="loading"-----用于出现加载效果  -->
        <el-table :data="skuInfoList" border v-loading="loading">
            <el-table-column property="date" label="名称" width="150" prop="skuName"></el-table-column>
            <el-table-column property="name" label="价格" width="200" prop="price"></el-table-column>
            <el-table-column property="address" label="重量" prop="weight"></el-table-column>
            <el-table-column property="address" label="图片">
                <template slot-scope="{row}">
                    <el-image style="width: 100px; height: 100px" :src="row.skuDefaultImg"></el-image>
                </template>
            </el-table-column>
        </el-table>
      </el-dialog>

  </div>
</template>

<script>
import spuForm from './spuForm'
import skuForm from './skuForm'
export default {
    name:"SPU",
    data() {
        return {
            category1id:'',
            category2id:'',
            category3id:'',
            spuList:[],//每一页展示的数据列表
            page:1,//当前页
            limit:5,//每一页展示数据的条数
            total:0,//总数据的条数
            screen:0,//用于控制三种结构的展示   0:展示数据列表   1:添加或修改spu     2:添加sku
            dialogTableVisible:false,//控制sku对话框的显示
            skuTitle:'',//sku列表的标题
            skuInfoList:[],//sku列表的信息
            loading:true
        }
    },
    components:{spuForm,skuForm},
    methods:{
        getCategoryId(data){
           const {category1id,category2id,category3id}=data
           this.category1id=category1id
           this.category2id=category2id
           this.category3id=category3id
           if(this.category3id!=''){
               this.getSpuList()
           }
        },
        // 发请求，获取spu数据列表
        // 因为这里将初始获取数据和改变展示页数的函数混合在一个函数里面，所以初始展示页为默认页
        async getSpuList(pager=1){
            this.page=pager
            const {page,limit,category3id}=this
            let result=await this.$API.spu.getSpuList(page,limit,category3id)
            if(result.code==200){
                this.spuList=result.data.records
                this.total=result.data.total
            }else{
                alert(new Error('faile'))
            }
        },
        //每一页展示的数据条数发生变化
        handleSizeChange(limit){
            this.limit=limit
            this.getSpuList()
        },
        // 添加或修改spu
        // 因为添加spu时是没有row的，所有要有默认值
        addOrEditSpu(data,row=''){
            this.screen=data
            // 利用ref获取子组件，然后在父组件中调用子组件的方法，发起请求
            this.$refs.spuForm.initData(row.id)
            this.$refs.spuForm.getInitData(this.category3id)
        },
        //自定义事件，点击取消时从spuform跳转到数据展示页面
        changeScreen(screen,id){
            this.screen=screen
            if(id!=''){
                this.getSpuList(this.page)//确保当前页不发生改变
            }else{
                this.getSpuList()//添加spu需要页面跳转到第一页
            }
        },
        //删除属性
        async deleteAttr(row){
            let result=await this.$API.spu.deleteSPU(row.id)
            if(result.code==200){
                this.getSpuList(this.spuList.length>1?this.page:this.page-1)
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
            }else{
                this.$message({
                    type:'error',
                    message:'删除失败'
                })
            }
        },
        // 添加sku
        addSku(row){
            // 调用子组件的方法，发起请求，获取初始化时需要的数据
            this.$refs.skuForm.getData(this.category1id,this.category2id,row)
            this.screen=2
        },
        // 从skuForm跳转到父组件
        changeSku(screen){
            this.screen=screen
        },
        // 显示sku列表
        async showSkuInfo(row){
            this.dialogTableVisible=true
            this.skuTitle=row.spuName
            let result =await this.$API.spu.getSkuInfoList(row.id)
            if(result.code==200){
                this.skuInfoList=result.data
                this.loading=false
            }
        },
        // 关闭对话框的回调
        close(done){//会自动传递一个done，用于关闭对话框
            this.loading=true
            this.skuInfoList=[]
            done()//关闭对话框
        }
    }
}
</script>

<style>

</style>