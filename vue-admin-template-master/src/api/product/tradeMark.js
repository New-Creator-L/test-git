//品牌管理接口
import request from '@/utils/request'

// 获取品牌列表信息
//page代表当前页码，limit代表每面展示的数据
export const reqTradeMark=(page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

//添加品牌信息  参数:品牌名称，logo----住：新增品牌是不需要带id的，因为id会在后台自动生成
//修改品牌信息   参数:品牌名称，logo，id
//因为两个请求只是带参数不同，故可以将接口写成一个
export const reqAddOrEditTradeMark=(tradeMark)=>{
    //携带id---修改
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',data:tradeMark,method:'put'})
    }else{//不携带id---新增 
        return request({url:'/admin/product/baseTrademark/save',data:tradeMark,method:'post'})
        }
    }

//删除商品
export const reqDeleteTradeMark=(id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})