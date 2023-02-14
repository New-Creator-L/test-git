<template>
  <div>
      <!-- 添加label-width之后，所有的item都会继承这个属性 -->
      <el-form label-width="80px" ref="form">
        <el-form-item label="SPU名称">
            <el-input  placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
              <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
                  <el-option :label="item.tmName" :value="item.id" v-for="item in brandList" :key="item.id"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <!-- 利用type将input框变为textarea
                rows:控制文本框的行数
            -->
            <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <!-- 这里不是上传图片，而是照片墙，只不过是用的同一个组件
                action:必选参数，图片上传的地址             list-type:文件列表的类型
                on-preview:预览图片时触发(自动将预览的图片的信息传递给函数)          on-remove:移除图片是触发(自动将删除之后剩余的图片信息传递给函数)
                file-list:上传的文件列表,必须有此字段才能展示照片墙,绑定的数据类型是一个数组，并且每个元素必须包含name和url属性，名称不能改
                on-success:文件上传成功时触发(自定带参数，具体参数见官网)
            -->
            <el-upload  
            action="/dev-api/admin/product/fileUpload" 
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="imageList"
            :on-success="handleSuccess">
                <i class="el-icon-plus"></i>
            </el-upload>
            <!-- :visible.sync--:visible控制对话框是否显示，值为布尔类型,sync控制父子组件数据同步 -->
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog> 
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select :placeholder="`还未选中${unSelectSaleAttr.length}项`" v-model="unSelectIdAneName">
                <!-- :value="`${item.id}:${item.name}`"---同时收集销售属性的id和名字 -->
                <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" style="margin-left:10px" :disabled="!unSelectIdAneName" @click="addSaleAttr">添加销售属性</el-button>
            <el-table style="width: 100%;margin:15px 0px" border :data="spuInfo.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                <el-table-column prop="saleAttrName" label="属性" width="width"></el-table-column>
                <el-table-column prop="prop" label="属性值名称列表" width="width">
                    <template slot-scope="{row}">
                        <!-- el-tag，用于展示属性值
                            closable---tag标签上有一个'x'按钮,
                            @close---点击tag上的'x'时触发回调
                         -->
                        <el-tag :key="item.id"  v-for="(item,index) in row.spuSaleAttrValueList"  closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">{{item.saleAttrValueName}}</el-tag>
                        <!-- 修改属性值 -->
                        <el-input class="input-new-tag" v-if="row.inputVisible" v-model="saleAttrValueName" ref="saveTagInput" size="small" @blur="changeInputValue(row)"></el-input>
                        <!-- 添加属性值 -->
                        <el-button v-else class="button-new-tag" size="small" @click="addSaleValue(row)">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                    <template slot-scope="{$index}">
                        <!-- 根据索引删除属性 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="spuInfo.spuSaleAttrList.splice($index,1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form-item>
                <el-button type="primary" @click="saveAttr">保存</el-button>
                <el-button @click="cancelData">取消</el-button>
            </el-form-item>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
    export default {
        name:'spuForm',
        data() {
            return {
                dialogImageUrl: '',//存放预览图片的url地址
                dialogVisible: false,//控制预览图片弹出框的显示和隐藏
                spuInfo:{},//spu信息，也是点击保存时带给服务器的最终数据
                brandList:[],//品牌列表
                saleList:[],//销售列表，销售属性一共只有三个
                imageList:[],//spu图片
                unSelectIdAneName:'',//选择要添加的销售属性的id和名称
                saleAttrValueName:'',//中转要添加的属性值
            }
        },
        methods:{
            // 删除图片时触发
            handleRemove(file, fileList) {
                // file---删除的图片信息      fileList---点击删除之后剩余图片的信息
                //这收集的照片墙的数据包含name和imageurl两个字段，但是服务器不需要，所以这里的数据不能放在spuInfo里面的imageList中
                this.imageList=fileList
            },
            // 预览图片时触发
            handlePictureCardPreview(file) {
                // file预览的图片信息
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //初始化发请求获取数据----这里发请求不写在mounted中是因为在父组件挂载的时候这个组件也会挂载，而不是等到点击父组件的修改时再发，v-show只是隐藏这个组件，并不会卸载这个组件
            async initData(id){
                // 因为添加和修改的spuInfo的数据格式不同，故需要单独赋值spuInfo的结构
                if(id!=undefined){
                    let resultSpu=await this.$API.spu.getSpuFormInfo(id)
                    if(resultSpu.code==200){
                        this.spuInfo=resultSpu.data
                        this.spuInfo.spuSaleAttrList.forEach(item=>{
                            this.$set(item,'inputVisible',false)
                        })
                    }else{
                        alert(new Error('faile'))
                    }
                    // 获取销售属性列表
                    let resultSale=await this.$API.spu.getSpuSaleList()
                    if(resultSale.code==200){
                        this.saleList=resultSale.data
                    }else{
                        alert(new Error('faile'))
                    }
                    // 获取品牌列表
                    let resultBrand=await this.$API.spu.getBrandList()
                    if(resultBrand.code==200){
                        this.brandList=resultBrand.data
                    }else{
                        alert(new Error('faile'))
                    }
                    // 获取spu图片
                    let resultImage=await this.$API.spu.getImageList(id)
                    if(resultImage.code==200){
                        let arrImage=resultImage.data
                        arrImage.forEach(item=>{
                            // 添加name和url属性展示照片墙
                            item.name=item.imgName
                            item.url=item.imgUrl
                        })
                        this.imageList=arrImage
                    }else{
                        alert(new Error('faile'))
                    }
                    this.unSelectId=''
                }else{
                    // 添加时的spuInfo的数据格式
                    this.spuInfo={
                        spuName: "",
                        tmId: '',//平台的id
                        category3Id: '',
                        description: "",
                        id: '',
                        //收集spu图片信息
                        spuImageList: [
                            // {
                            // id: 0,
                            // imgName: "",
                            // imgUrl: "",
                            // spuId: 0
                            // }
                        ],
                        // 平台属性和属性值的信息
                        spuSaleAttrList: [
                            // {
                            // baseSaleAttrId: 0,
                            // id: 0,
                            // saleAttrName: "",
                            // spuId: 0,
                            // spuSaleAttrValueList: [
                                // {
                                // baseSaleAttrId: 0,
                                // id: 0,
                                // isChecked: "",
                                // saleAttrName: "",
                                // saleAttrValueName: "",
                                // spuId: 0
                                // }
                                // ]
                            // }
                        ]
                        }
                    this.unSelectId=''
                }
            },
            //文件上传成功
            handleSuccess(response, file, fileList){
                // file:上传成功的图片信息      fileList所有的图片信息，         response---上传成功时服务器返回的信息
                if(response.code==200){
                    this.imageList=fileList
                }else{
                    this.$message({
                        type:'error',
                        message:'上传失败'
                    })
                }
            },
            // 添加销售属性的信息至spuInfo中
            addSaleAttr(){
                let [baseSaleAttrId,saleAttrName]=this.unSelectIdAneName.split(':')
                // 将销售属性添加到spuInfo.spuSaleAttrList中        
                // 因为服务器只需要baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]这三个字段，所以我们添加时只定义这三个数据
                this.spuInfo.spuSaleAttrList.push({baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]})
                this.unSelectIdAneName=''
            },
            // 添加销售属性值
            addSaleValue(row){
                this.$set(row,'inputVisible',true)
                this.$nextTick(()=>{
                    this.$refs.saveTagInput.focus()
                })
            },
            // input框失去焦点时展示button
            changeInputValue(row){
                const saleAttrValueName=this.saleAttrValueName
                const baseSaleAttrId=row.baseSaleAttrId
                if(saleAttrValueName.trim()===''){
                    this.$message({
                        type:'info',
                        message:'添加的属性值不能为空'
                    })
                    row.inputVisible=false
                    this.saleAttrValueName=''
                    this.$refs.saveTagInput.focus()
                    return;
                }
                const result=row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=saleAttrValueName)
                if(!result){
                    this.$message({
                        type:'info',
                        message:'添加的属性已存在'
                    })
                    this.$refs.saveTagInput.focus()
                    return;
                }
                row.spuSaleAttrValueList.push({baseSaleAttrId,saleAttrValueName})
                row.inputVisible=false
                this.saleAttrValueName=''
            },
            // 保存修改的信息
            async saveAttr(){
                // 整理参数，发请求
                this.spuInfo.spuImageList=this.imageList.map(item=>{
                    return {
                        // 服务器需要spuInfo中的spuImageList参数必须有imageName、imageUrl两个字段，但是图片展示又必须要name和url两个字段，所以需要将name和url整合到imgName和imageUrl上
                        imgName:item.name,
                        // 图片的地址应该是服务器的地址，如果没有服务器的地址则存本地的地址
                        imgUrl:(item.response&&item.response.data) || item.url
                    }
                })
                const result=await this.$API.spu.addOrEditSpu(this.spuInfo)
                if(result.code==200){
                    // 通过spuInfo的id区分是添加还是修改，添加的id为''
                    this.$emit('changeScreen',0,this.spuInfo.id)
                    this.$message({
                        type:'success',
                        message:'信息保存成功！'
                    })
                }else{
                    this.$message({
                        type:'error',
                        message:'信息保存失败！'
                    })
                }
                // 清空数据
                Object.assign(this._data,this.$options.data())
            },
            // 添加spu时获取品牌列表和销售属性列表
            async getInitData(id){
                this.spuInfo.category3Id=id
                let resultBrand=await this.$API.spu.getBrandList()
                if(resultBrand.code==200){
                    this.brandList=resultBrand.data
                }else{
                    alert(new Error('faile'))
                }
                let resultSale=await this.$API.spu.getSpuSaleList()
                if(resultSale.code==200){
                    this.saleList=resultSale.data
                }else{
                    alert(new Error('faile'))
                }
            },
            // 点击取消时清除上一次的数据残留
            cancelData(){
                this.$emit('changeScreen',0)
                //清空数据
                // this.$options为组价传入的配置项
                Object.assign(this._data,this.$options.data())
            }
        },
        computed:{
            // 计算出商品没有的销售属性
            unSelectSaleAttr(){
                let result=this.saleList.filter(item=>{
                    return this.spuInfo.spuSaleAttrList.every(attr=>{
                        return item.name!=attr.saleAttrName
                    })
                })
                return result;
            }
        }
    }
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>