<template>
    <div>
        <el-table style="width: 100%" border :data="records">
            <el-table-column label="序列" width="80" type="index" align="center"></el-table-column>
            <el-table-column prop="skuName" label="名称"></el-table-column>
            <el-table-column prop="skuDesc" label="描述"></el-table-column>
            <el-table-column label="默认图片" width="150" align="center">
                <template slot-scope="{row}">
                    <el-image style="width: 100px; height: 100px" :src="row.skuDefaultImg" ></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量(KG)" width="120" align="center"></el-table-column>
            <el-table-column prop="price" label="价格(元)" width="120" align="center"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <el-button type="success" icon="el-icon-download" size="small" v-if="row.isSale==1" @click="downSale(row)"></el-button>
                    <el-button type="info" icon="el-icon-upload2" size="small" v-else @click="upSale(row)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="info"></el-button>
                    <el-button type="info" icon="el-icon-info" size="small" @click="isShowDrawer(row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange(limit)"
            @current-change="getDate"
            style="text-align:center"
            :current-page="page"
            :page-sizes="[3, 5, 10]"
            :page-size="limit"
            layout="prev, pager, next, jumper,->,sizes,total"
            :total="total">
        </el-pagination>
        <!-- 抽屉效果 -->
        <el-drawer :visible.sync="drawer" size="40%" :show-close='false'>
            <!-- layout布局，即：网格布局 -->
            <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="16">{{skuInfo.skuName}}</el-col>
            </el-row>
             <el-row>
                <el-col :span="5">描述</el-col>
                <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
            </el-row>
             <el-row>
                <el-col :span="5">价格</el-col>
                <el-col :span="16">{{skuInfo.price}}元</el-col>
            </el-row>
             <el-row>
                <el-col :span="5">平台属性</el-col>
                <el-col :span="16">
                    <template>
                        <el-tag type="success" v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin-left:10px">{{item.attrId}}+{{item.valueId}}</el-tag>
                    </template>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="5">商品图片</el-col>
                <el-col :span="16">
                    <!-- 走马灯，与轮播图的效果相同 -->
                     <el-carousel trigger="click" height="400px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <el-image :src='item.imgUrl'></el-image>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name:"SKU",
    data(){
        return {
            page:1,
            total:0,
            limit:5,
            records:[],//存储sku列表的数据
            skuInfo:{},//存储sku数据详情
            drawer:false,//是否显示抽屉
        }
    },
    mounted(){
        this.getDate()
    },
    methods:{
        // 初始化获取数据
        async getDate(pages=1){
            this.page=pages
            const {page,limit}=this
            let result=await this.$API.sku.getSkuList(page,limit)
            if(result.code==200){
                this.records=result.data.records
                this.total=result.data.total
            }
        },
        //每页展示的数据发生变化时触发
        handleSizeChange(limit){
            this.limit=limit
            this.getSpuList()
        },
        // 商品下架
        async downSale(row){
            let result = await this.$API.sku.reqCancel(row.id)
            if(result.code==200){
                row.isSale=0
                this.$message({
                    type:'success',
                    message:'商品下架成功'
                })
            }
        },
        // 商品上架
        async upSale(row){
            let result = await this.$API.sku.reqSale(row.id)
            if(result.code==200){
                row.isSale=1
                this.$message({
                    type:'success',
                    message:'商品上架成功'
                })
            }
        },
        // 弹出信息：正在开发中
        info(){
            this.$message({
                type:'info',
                message:'正在开发中'
            })
        },
        async isShowDrawer(row){
            this.drawer=true
            let result = await this.$API.sku.reqGetInfo(row.id)
            if(result.code==200){
                this.skuInfo=result.data
            }
        }
    }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .el-carousel__button{
      width: 15px;
      height:15px;
      background: skyblue;
      border-radius: 50%;
  }
</style>
<style>
    .el-row .el-col-5 {
        margin: 5px 10px;
        text-align: right;
        font-size: 1.3em;
        font-weight: bold;
    }
    .el-row .el-col-16 {
        margin: 5px 10px;
        padding-top: 3px;
    }
</style>