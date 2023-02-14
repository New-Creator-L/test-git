<template>
    <el-card class="box-card" style="margin:15px 0px">
      <div slot="header" class="clearfix">
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="first"></el-tab-pane>
          <el-tab-pane label="访问量" name="second"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">本日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            class="data"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="data"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div class="stores">
            <h4>门店{{title}}排名</h4>
            <ul>
              <li>
                <span class="sright">1</span>
                <span class="content">肯德基</span>
                <span class="svalue">123,456</span>
              </li>
              <li>
                <span class="sright">2</span>
                <span class="content">麦当劳</span>
                <span class="svalue">123,456</span>
              </li>
              <li>
                <span class="sright">3</span>
                <span class="content">华莱士</span>
                <span class="svalue">123,456</span>
              </li>
              <li>
                <span  class="sright2">4</span>
                <span>乡村基</span>
                <span class="svalue">123,456</span>
              </li>
              <li>
                <span  class="sright2">5</span>
                <span>古茗</span>
                <span class="svalue">123,456</span>
              </li>
              <li>
                <span  class="sright2">6</span>
                <span>蜜雪冰城</span>
                <span class="svalue">123,456</span>
              </li>
              <li>
                <span  class="sright2">7</span>
                <span>CoCo</span>
                <span class="svalue">123,456</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-card>
</template>

<script>
    import * as echarts from 'echarts'
    import dayjs from 'dayjs'//引入时间插件库
    export default {
        name:'Sale',
        data() {
          return {
            activeName:'first',
            myEcharts:null,
            data:[],//收集日历的数据
          }
        },
        mounted(){
          this.myEcharts=echarts.init(this.$refs.charts)
          this.myEcharts.setOption({
            title:{
              text:'销售额趋势'
            },
            tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月',],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '60%',
              data: [100, 52, 200, 334, 390, 330, 220,200,150,60,180,170],
              color:'#409eff'
            }
          ]
          })
        },
        computed:{
          // 计算排名的种类
          title(){
            return this.activeName=='first'?'销售额':'访问量'
          }
        },
        watch:{
          // 监听title，当标题改变时更新图表的标题
          title(){
              this.myEcharts.setOption({
                title:{
                  text:this.activeName=='first'?'销售额'+'趋势':'访问量'+'趋势'
                },
                series:[{
                  data: this.activeName=='first'?[100, 52, 200, 334, 390, 330, 220,200,150,60,180,170]:[370, 109, 240, 304, 50, 130, 220,290,250,360,180,170],
                }]
            })
          }
        },
        methods:{
          // 收集当天的日期
          setDay(){
            const time=dayjs().format("YYYY-MM-DD")
            this.data=[time,time]
          },
          // 获取当前星期的事件
          setWeek(){
            const start=dayjs().day(0).format("YYYY-MM-DD")
            const end=dayjs().day(6).format("YYYY-MM-DD")
            this.data=[start,end]
          },
          // 获取当前月的时间
          setMonth(){
            const start=dayjs().startOf('month').format("YYYY-MM-DD")
            const end=dayjs().endOf('month').format("YYYY-MM-DD")
            this.data=[start,end]
          },
          // 获取当年的时间
          setYear(){
            const start=dayjs().startOf('year').format("YYYY-MM-DD")
            const end=dayjs().endOf('year').format("YYYY-MM-DD")
            this.data=[start,end]
          }
        }
    }
</script>

<style scoped>
  .clearfix{
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  .tab{
    width: 100%;
  }
  .right{
    position: absolute;
    right: 0px;
  }
  .data{
    width: 250px;
    margin-left:10px ;
  }
  .right span{
    margin: 0px 10px;
  }
  .charts{
    width: 100%;
    height: 300px;
  }
  .stores{
    width: 100%;
    height: 300px;
  }
  h4{
    padding: 0px;
  }
  .stores ul{
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0px;
  }
  .stores ul li{
    height: 12%;
    position: relative;
    margin: 5px 0px;
  }
  .sright{
    float: left;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: black;
    color: white;
    text-align: center;
    padding-top: 4px;
  }
  .sright2{
    float: left;
    margin: 0px 15px 0px 10px;
  }
  .svalue{
    float: right;
    position: relative;
    top: 3px;
    }
  .content{
    position: absolute;
    top: 3px;
    margin-left: 8px;
  }
</style>