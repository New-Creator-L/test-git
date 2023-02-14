<template>
  <el-card>
      <div slot="header" class="header">
          <div class="top">
              <span>线上热门搜索</span>
              <!-- 下拉框 -->
              <el-dropdown>
                <span>
                    <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item>双皮奶</el-dropdown-item>
                    <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
          </div>
      </div>
      <div class="graph">
          <el-row :gutter="10">
              <el-col :span="12">
                  <Echarts></Echarts>
              </el-col>
              <el-col :span="12">
                  <Echarts></Echarts>
              </el-col>
          </el-row>
      </div>
      <!-- table表格 -->
       <el-table style="width: 100%; margin-top:10px" border>
            <el-table-column label="排名"  width="80" type="index">
            </el-table-column>
            <el-table-column label="搜索关键字" width="180">
            </el-table-column>
            <el-table-column label="用户数" sortable>
            </el-table-column>
            <el-table-column label="周涨幅" sortable>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination layout="prev, pager, next" :total="100" style="text-align:center"> </el-pagination>
  </el-card>
</template>

<script>
    import Echarts from './Echarts'
    export default {
        name:'Left',
        components:{Echarts}
    }
</script>

<style scoped>
.top{
    display: flex;
    justify-content: space-between;
}
.header{
    border-bottom: 2px solid #eee;
    padding-bottom: 5px;
}
</style>