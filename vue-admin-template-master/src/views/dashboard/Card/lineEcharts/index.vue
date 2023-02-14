<template>
  <div class="echarts" ref="echarts">
  </div>
</template>

<script>
    import * as echarts from 'echarts'
    export default {
        name:'lineEcharts',
        mounted(){
            // 初始化实例
            let lineEcharts=echarts.init(this.$refs.echarts)
            // 配置数据
            lineEcharts.setOption({
                xAxis:{
                    // 隐藏x轴
                    show:false,
                    type:'category',//均分坐标轴
                },
                yAxis:{
                    show:false
                },
                // 图标的系列
                series:[{
                    type:'line',//图标的类型
                    data:[20,10,30,55,10],
                    // 这是拐点的透明度
                    itemStyle:{
                        opacity:0
                    },
                    // 这是线条颜色
                    lineStyle:{
                        color:"purple"
                    },
                    // 填充颜色设置
                    areaStyle:{
                        // 设置图表的颜色
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'purple' // 0% 处的颜色
                                }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    },
                }],
                //布局调试
                grid:{
                    left:0,
                    right:0,
                    top:0,
                    bottom:0
                }
            })
        }
    }
</script>

<style>
.echarts{
    width: 100%;
    height: 100%;
}
</style>