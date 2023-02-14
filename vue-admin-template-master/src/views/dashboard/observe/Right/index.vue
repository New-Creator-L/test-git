<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="context">
          <span>销售额类别占比</span>
          <el-radio-group size="small" v-model="radio">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上" ></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
    import * as echarts from 'echarts'
    export default {
        name:'Right',
        data() {
          return {
            radio:'全部渠道'
          }
        },
        mounted(){
          let myEcharts=echarts.init(this.$refs.charts)
          myEcharts.setOption({
              title:{
                text:'海贼王',
                subtext:1048,
                left:"center",
                top:"center"
              },
              tooltip: {
                trigger: 'item'
              },
              series: [
                {
                  name: 'Access From',
                  type: 'pie',
                  radius: ['40%', '80%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 3,
                    borderColor: '#fff',
                    borderWidth: 2
                  },
                  label: {
                    show: true,
                    position: 'outsize'
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: '40',
                      fontWeight: 'bold'
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  data: [
                    { value: 1048, name: '海贼王' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                  ]
                }
              ]
            })
          // 绑定事件
          myEcharts.on("mouseover",(params)=>{
            // params,鼠标指向的对象的数据
            let {name,value}=params.data
            myEcharts.setOption({
              title:{
                text:name,
                subtext:value
              }
            })
          })
        }
    }
</script>

<style scoped>
.context{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 7px;
}
.header{
  border-bottom: 1px solid #eee;
}
.charts{
  width: 100%;
  height: 300px;
}
</style>