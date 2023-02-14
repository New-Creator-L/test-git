<template>
  <div>
      <el-row :gutter="10">
          <el-col :span="6">
              <el-card>
                  <Detail title="总销售额" number="￥126560">
                      <!-- 具名插槽 -->
                      <template slot="charts">
                        <span class="span-one">周同比&nbsp;&nbsp;&nbsp;&nbsp;56.67%<svg t="1652626795184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1899" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="1900" fill="#d81e06"></path></svg></span>
                        <span>日同比&nbsp;&nbsp;&nbsp;&nbsp;19.16%<svg t="1652626920632" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2775" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="2776" fill="#1afa29"></path></svg></span>
                      </template>
                      <template slot="footer">
                          <span>日销售额￥12432</span>
                      </template>
                  </Detail>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card>
                  <Detail title="访问量" number="88460">
                      <template slot="charts">
                          <lineEcharts></lineEcharts>
                      </template>
                      <template slot="footer">
                          <span>日销访问量1234</span>
                      </template>
                  </Detail>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card>
                  <Detail title="支付笔数" number="88460">
                      <template slot="charts">
                          <barEcharts></barEcharts>
                      </template>
                      <template slot="footer">
                          <span>日销转化率 65%</span>
                      </template>
                  </Detail>
              </el-card>
          </el-col>
          <el-col :span="6">
              <el-card>
                  <Detail title="运营活动效果" number="78%">
                      <template slot="charts">
                          <progressEcharts></progressEcharts>
                      </template>
                      <template slot="footer">
                        <span class="span-one">周同比&nbsp;&nbsp;&nbsp;&nbsp;12%<svg t="1652626795184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1899" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" p-id="1900" fill="#d81e06"></path></svg></span>
                        <span>日同比&nbsp;&nbsp;&nbsp;&nbsp;11%<svg t="1652626920632" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2775" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="2776" fill="#1afa29"></path></svg></span>
                      </template>
                  </Detail>
              </el-card>
          </el-col>
      </el-row>
  </div>
</template>

<script>
    import Detail from './detail'
    import lineEcharts from './lineEcharts'
    import barEcharts from './barEcharts'
    import progressEcharts from './progressEcharts'
    export default {
        name:'Card',
        components:{Detail,lineEcharts,barEcharts,progressEcharts}
    }
</script>

<style>
    .span-one {
        margin-right: 20px;
    }
</style>