<template>
  <div>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px" @click="addfirm">首页</el-button>
      <!-- 表格---el-table，通常和el-table-column一起使用
                data---用于存放表格的数据---数据类型必须是数组----展示数据是一列一列进行展示的
                border---表格的边框
            表格的列---el-table-column----展示的属性值直接写属性名即可
                label--显示表格第一行信息
                width---列的宽度
                align---表格信息的对齐方式(left/center/right)
                type="idnex"---展示序号
                prop----展示data中数据的,值为table中data中的属性值
     -->
      <el-table border :data="list">
        <el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌Logo">
          <!-- 作用域插槽
            row---服务返回的数据
           -->
          <template slot-scope="{row}">
              <img :src="row.logoUrl" style="width:100px;height:80px;">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateInfo(row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delinfo(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器---el-pagionation
                注意点:当前第几页，数据总条数，每一页展示条数，连续页码数
                @size-change="handleSizeChange"---每一页展示的数据发生改变时触发
                @current-change="handleCurrentChange"---当前页发生变化时触发
                layout---里面数据的位置就代表对应小组件在页面中的位置(里面的"->"就将"->"后面的组件直接放在页面最右边)
                page-sizes---对每一页显示数据的条数进行切换
                pager-count----显示页码数按钮的个数----但是中间连续的页码按钮为"设置的数-2",因为有一个"1"和"最后一页"
      -->
      <!-- size-change(传入每页展示数据的条数)和current-change(传入当前页数)都自动传入参数 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="getPageList"
          style="textAlign:center;margin-top:20px"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total">
      </el-pagination>
      <!--添加品牌(el-dialog--dialog对话框)
            title:显示对话框的标题
            :visible.sync--:visible控制对话框是否显示，值为布尔类型,sync控制父子组件数据同步
      -->
      <el-dialog :title="tradeInfo.id?'修改品牌信息':'添加品牌信息'" :visible.sync="dialogFormVisible">
        <!-- 
          Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
          添加rules时，表单必须要有model属性
           -->
        <el-form style="width:80%" :model="tradeInfo" :rules="rules" ref="ruleForm" >
          <el-form-item label="品牌名称" label-width="100px" prop="tmName">
            <el-input autocomplete="off" v-model="tradeInfo.tmName"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
            <!--el-upload----上传图片到服务器，但是这只能上传一张，若要上传多张，见官网up-load-照片墙
                :show-file-list----是否展示文件列表，这里只传一张，故为false
                on-success----上传成功时触发
                before-upload-----上传之前触发
                action---上传图片到服务器的地址
              -->
             <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              action="/dev-api/admin/product/fileUpload"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="tradeInfo.logoUrl" :src="tradeInfo.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEdit">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:"tradeMark",
    data() {
      // rule:指向验证的对象    value:验证对象的值    callback:回调，如果失败定义一个失败信息，成功直接回调代表放行
      var validateTmName = (rule, value, callback) => {
        if(value.length<2||value.length>10){
          callback(new Error("品牌名称字数在2-10之间"))
        }else{
          callback();//放行
        }
      };
      return {
        page:1,//代表分页器的第几页
        limit:5,//页面展示数据的条数
        list:[],//页面展示的数据
        total:0,//数据总条数
        dialogFormVisible:false,//控制对话框是否显示
        tradeInfo:{//收集表单的数据
          //这里属性名必须和接口参数名一致，因为我们写的api是用对象包裹的，如果属性名不同，结构就找不到对应的数据
          tmName:'',
          logoUrl:'',
          id:''
        },
        rules:{//表单验证,里面的属性名是需要验证的属性名
          tmName:[
            // required：是否必须(有此选项，则标签前面会有一个红色的*表示必须要验证)      message(提示的信息)         trigger(触发事件的行为(只有两种:blur,change))
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            //自定义验证规则(要求和表单验证相同，都需要rule、ref....)      validator:一个箭头函数，里面包含自定义的规则，并且这个箭头函数是在data中
            { validator: validateTmName, trigger: 'change' }
          ],
          logoUrl: [
            { required: true, message: '请添加品牌图片'}
          ],
        }
      }
    },
    mounted(){
      this.getPageList()
    },
    methods:{
      //获取品牌信息
      //"pager=1"---如果没有传参数则默认是1(为了是mounted中调用getPageList不报错，mounted不会保证所有子组件都挂载完毕，故最开始的时候需要赋初值，不然传给服务器的参数就是空)
       async getPageList(pager=1){
        this.page=pager
         //结构参数
         const {page,limit}=this
         //发请求
         let result =await this.$API.tradeMark.reqTradeMark(page,limit)
         if(result.code==200){
           this.list=result.data.records
           this.total=result.data.total
         }else{
           alert(new Error('faile'))
         }
       },
       //更改页面展示数据条数
       handleSizeChange(limit){
         this.limit=limit
         this.getPageList()
       },
      //  修改对话框的状态
       addfirm(){
        //  每次新增之前清除上一次残留的信息
         this.dialogFormVisible=true
         this.tradeInfo={tmName:'',logoUrl:''}
       },
       //修改页面信息
       updateInfo(row){
         this.dialogFormVisible=true
        //  row保存的是服务器返回的数据，而this.tradeInfo=row相当于row和tradeInfo指向的都是服务返回的数据，
        // 若修改对话框中的信息，就相当于修改服务器返回的数据，也就是修改row中的数据，而页面展示的就是row中的数据，股页面信息会改变
         this.tradeInfo={...row}//将数据浅拷贝给tradeInfo,就不会引起服务器的数据改变
       },
      // 图片上传成功
      handleAvatarSuccess(res, file) {
        // res和file都是服务器返回的对象，但是file里面数据会比row多，两者中都有一个data属性，里面存放的是图片在服务器上的地址
        this.tradeInfo.logoUrl=res.data
      },
      // 图片上传之前
      beforeAvatarUpload(file) {
        // 判断图片类型
        const isJPG = file.type === 'image/jpeg';
        // 判断图片大小
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 添加或修改品牌信息
      addOrEdit(){
        // 这里的async应该放在例wait最近的一个函数里
        this.$refs.ruleForm.validate(async (success) => {
          if (success) {
            this.dialogFormVisible=false//隐藏对话框
            let result = await this.$API.tradeMark.reqAddOrEditTradeMark(this.tradeInfo)
            if(result.code==200){
              // $message--element的一个消息弹框小组件,里面传入一个配置项可以改变样式，详见官网
              this.$message({
                type: 'success',
                message: this.tradeInfo.id?"修改品牌成功":"添加品牌成功"
              })
              // 如果是添加品牌就跳到第一页，如果是修改品牌就停在当前页
              this.getPageList(this.tradeInfo.id?this.page:1)
        }
          } else {
            alert('error submit!!');
            return false;
          }
        });
      },
      //删除品牌信息
      delinfo(row){
        //弹框
        this.$confirm(`是否删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {//点击确定时触发
          let result=await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if(result.code==200){
            this.$message({
            type: 'success',
            message: '删除成功!'
            });
          }
          //重新获取数据渲染页面,并且判断当前页删除数据之后是否还有数据，没有则跳到前一页，有则继续保持在当前页
          this.getPageList(this.list.length>1?this.pager:this.pager-1)
        })
        .catch(() => {//点击取消时触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }

}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>