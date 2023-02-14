<template>
    <div>
        <div class="header">
            <span class="number">搜索用户数</span>
            <svg t="1652625890464" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1902" width="20" height="20"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512S793.6 1024 512 1024zM512 85.333333C277.333333 85.333333 85.333333 277.333333 85.333333 512s192 426.666667 426.666667 426.666667 426.666667-192 426.666667-426.666667S746.666667 85.333333 512 85.333333z" p-id="1903" fill="#8a8a8a"></path><path d="M469.333333 768c-17.066667 0-29.866667-8.533333-42.666667-21.333333-21.333333-29.866667-4.266667-72.533333 42.666667-187.733333 8.533333-17.066667 17.066667-38.4 25.6-55.466667-17.066667 12.8-42.666667 12.8-59.733333-4.266667-17.066667-17.066667-17.066667-42.666667 0-59.733333C443.733333 435.2 494.933333 384 554.666667 384c17.066667 0 29.866667 8.533333 42.666667 21.333333 21.333333 29.866667 4.266667 72.533333-42.666667 187.733333-8.533333 17.066667-17.066667 38.4-25.6 55.466667 17.066667-12.8 42.666667-12.8 59.733333 4.266667 17.066667 17.066667 17.066667 42.666667 0 59.733333C580.266667 716.8 529.066667 768 469.333333 768z" p-id="1904" fill="#8a8a8a"></path><path d="M576 277.333333m-64 0a1.5 1.5 0 1 0 128 0 1.5 1.5 0 1 0-128 0Z" p-id="1905" fill="#8a8a8a"></path><path d="M576 362.666667c-46.933333 0-85.333333-38.4-85.333333-85.333333s38.4-85.333333 85.333333-85.333333 85.333333 38.4 85.333333 85.333333S622.933333 362.666667 576 362.666667zM576 234.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666667 42.666667-17.066667 42.666667-42.666667S601.6 234.666667 576 234.666667z" p-id="1906" fill="#8a8a8a"></path></svg>
        </div>
        <div class="context">
            <span class="range">12321</span>
            <span>17.1%<svg t="1652626920632" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2775" width="16" height="16"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" p-id="2776" fill="#1afa29"></path></svg></span>
        </div>
        <div class="footer">
            <div class="charts" ref="echarts"></div>
        </div>
    </div>
</template>

<script>
    import * as echarts from 'echarts'
    export default {
        name:'Echarts',
        data() {
            return {
                lineEcharts:null
            }
        },
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
                    data:[20,40,30,55,15.20,18,35],
                    // 这是拐点的透明度
                    itemStyle:{
                        opacity:0
                    },
                    // 这是线条颜色
                    lineStyle:{
                        color:"#409eff"
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
                                offset: 0, color: '#409eff' // 0% 处的颜色
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

<style scoped>
.header{    
    display:flex;
    /* 垂直居中 */
    align-items: center;
}
.number{
    margin-right: 20px;
}
.context{
    margin-top: 20px;
}
.range{
    margin: 15px 20px 0px 0px;
    font-size: 25px;
    font-weight: 105px;
}
.charts{
    width: 100%;
    height: 50px;
}
</style>