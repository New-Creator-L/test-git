<template>
    <div>
        <el-form ref="form"  label-width="80px">
            <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input  placeholder="价格(元)" v-model.number="skuInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input  placeholder="重量(千克)" v-model.number="skuInfo.weight"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea"  placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form :inline="true" ref="form"  label-width="80px">
                    <el-form-item :label="item.attrName" v-for="item in attrInfoList" :key="item.id">
                        <!-- v-model="item.attrIdAndValueId"将需要的字段收集在所对应的对象上 -->
                        <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
                            <el-option :label="valueList.valueName" :value="`${item.id}:${valueList.id}`" v-for="valueList in item.attrValueList" :key="valueList.id">
                            </el-option>
                        </el-select>
                    </el-form-item>                  
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form :inline="true" ref="form"  label-width="80px">
                    <el-form-item :label="item.saleAttrName" v-for="item in attrList" :key="item.id">
                    <el-select placeholder="请选择" v-model="item.attrListIdAndValueId" >
                        <el-option :label="saleList.saleAttrValueName" :value="`${item.id}:${saleList.id}`" v-for="saleList in item.spuSaleAttrValueList" :key="saleList.id">
                        </el-option>
                    </el-select>
                    </el-form-item>
                </el-form>                
            </el-form-item>
            <el-form-item label="图片列表">
                <!-- @selection-change----当多选框发生变化时触发------会自动将选中的图片信息当做参数传递，是一个数组 -->
                <el-table border :data="spuImageList" @selection-change="handleSelectionChange" style="width:100%">
                    <!-- type="selection"----将该列变为多选框-->
                    <el-table-column type="selection" width="90"></el-table-column>
                    <el-table-column label="图片" >
                        <template slot-scope="{row}">
                            <el-image style="width: 100px; height: 100px" :src="row.imgUrl"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" prop="imgName" >
                    </el-table-column>
                    <el-table-column label="地址" >
                        <template slot-scope="{row}">
                            <el-button type="primary" v-if="row.isDefault==0" @click="setDefault(row)" size="small">设置为默认</el-button>
                            <el-button type="success" size="mini" plain v-else>默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSku">保存</el-button>
                <el-button @click="cancelAddSku" >取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name:'skuForm',
        data(){
            return {
                spuImageList:[],//存放图片列表
                attrList:[],//存放销售属性列表
                attrInfoList:[],//存放平台属性列表
                skuInfo:{//最终带给服务器的数据
                    category3id:'',
                    spuId:'',
                    tmId:'',
                    skuName:'',
                    price:0,
                    weight:0,
                    skuDesc:'',
                    skuAttrValueList:[],//平台属性列表
                    skuDefaultImg:'',//默认图片
                    skuImageList:[],//图片列表
                    skuSaleAttrValueList:[]//销售属性
                },
                spu:{},//父组件传递row
                imageList:[],//表格选中的图片信息，但是数据是缺少一个isDefault属性
            }
        },
        methods:{
            // 获取skuform初始化时需要展示的数据
            async getData(category1id,category2id,row){
                this.spu=row
                this.skuInfo.category3id=row.category3Id
                this.skuInfo.spuId=row.id
                this.skuInfo.tmId=row.tmId
                // 获取图片信息
                let resultImage=await this.$API.spu.reqSpuImageList(row.id)
                if(resultImage.code==200){
                    let middleList=resultImage.data
                    middleList.forEach(item=>{
                        item.isDefault=0//0为设置默认，1为默认
                    })
                    this.spuImageList=middleList
                }
                // 获取销售属性列表
                let resultAttr=await this.$API.spu.reqSpuSaleAttrList(row.id)
                if(resultAttr.code==200){
                    this.attrList=resultAttr.data
                }
                // 获取平台属性列表
                let resultAttrInfo=await this.$API.spu.reqAttrInfoList(category1id,category2id,row.category3Id)
                if(resultAttrInfo.code==200){
                    this.attrInfoList=resultAttrInfo.data
                }
            },
            // 表格多选框发生变化时触发----
            handleSelectionChange(params){
                this.imageList=params
            },
            // 取消添加
            cancelAddSku(){
                this.$emit('changeSku',0)
                // 清空数据
                Object.assign(this._data,this.$options.data())
            },
            // 设置为默认图片
            setDefault(row){
                // 排他算法
                this.spuImageList.forEach(item=>{
                    item.isDefault=0
                })
                row.isDefault=1
                // 收集默认图片的地址
                this.skuInfo.skuDefaultImg=row.imgUrl
            },
            // 保存添加的sku
            async saveSku(){
                // 整理参数
                const {attrInfoList,attrList,spuImageList}=this
                // 整理平台属性的数据
                // 法一：利用forEach             
                attrInfoList.forEach(item=>{
                    if(item.attrIdAndValueId){
                        // 数组结构
                        const [attrId,valueId]=item.attrIdAndValueId.split(':')
                        this.skuInfo.skuAttrValueList.push({attrId,valueId})
                    }
                })
                // 整理销售属性的数据
                // 法二：利用reduce
                this.skuInfo.skuSaleAttrValueList=attrList.reduce((pre,item)=>{
                    if(item.attrListIdAndValueId){
                        const [saleAttrId,saleAttrValueId]=item.attrListIdAndValueId.split(':')
                        pre.push({saleAttrId,saleAttrValueId})
                    }
                    return pre
                },[])
                // 整理图片数据
                this.skuInfo.skuImageList=spuImageList.map(item=>{
                    return {
                        imgName:item.imgName,
                        imgUrl:item.imgUrl,
                        isDefault:item.isDefault,
                        spuImgId:item.spuImgId,
                    }
                })
                let result =await this.$API.spu.reqAdsdsku(this.skuInfo)
                if(result.code==200){
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                    this.$emit('changeSku',0)
                    // 清空数据
                    Object.assign(this._data,this.$options.data())
                }else{
                    this.$message({
                        type:'error',
                        message:'添加失败'
                    })
                }
            }
        }
    }
</script>

<style>

</style>