<template>
  <div class="barEcharts" ref="barEcharts"></div>
</template>

<script>
    import * as echarts from 'echarts'
    export default {
        name:'barEcharts',
        mounted(){
            // 初始化实例
            let lineEcharts=echarts.init(this.$refs.barEcharts)
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
                    type:'bar',//图标的类型
                    data:[20,10,30,55,10,30,25],
                    color:'skyblue'
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
.barEcharts{
    width: 100%;
    height: 100%;
}
</style>