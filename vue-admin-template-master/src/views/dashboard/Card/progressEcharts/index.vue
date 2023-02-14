<template>
  <div class="progressEcharts" ref="progressEcharts"></div>
</template>

<script>
    import * as echarts from 'echarts'
    export default {
        name:'barEcharts',
        mounted(){
            // 初始化实例
            let lineEcharts=echarts.init(this.$refs.progressEcharts)
            // 配置数据
            lineEcharts.setOption({
                xAxis:{
                    // 隐藏x轴
                    show:false,
                    // 设置最大值和最小值
                    min:0,
                    max:100
                },
                yAxis:{
                    show:false,
                    // 写在y轴上，数据的分布就在y轴上
                    type:'category',//均分坐标轴
                },
                // 图标的系列
                series:[{
                    type:'bar',//图标的类型
                    data:[78],
                    // 柱状图的宽度
                    barWidth:10,
                    color:'yellowgreen',
                    // 设置背景颜色
                    showBackground:true,//只有设置为true才能设置背景颜色
                    backgroundColor:{
                        color:'#eee',//设置线条颜色
                    },
                    // 这是文本
                    label:{
                        show:true,
                        formatter:'|',//文本内容
                        position:'right',//设置对齐方式
                    }
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
.progressEcharts{
    width: 100%;
    height: 100%;
}
</style>