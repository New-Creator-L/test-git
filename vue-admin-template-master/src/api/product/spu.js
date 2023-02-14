import request from '@/utils/request'

// 获取spu数据列表
export const getSpuList=(page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

// spuForm中获取spu数据
export const getSpuFormInfo=(spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// spuForm中获取销售属性列表(任何一个spu的此属性都只有三个)
export const getSpuSaleList=()=>request({url:'/admin/product/baseSaleAttrList',method:'get'})

// spuForm中获取品牌列表
export const getBrandList=()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

// spuForm中获取图片
export const getImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 添加spu||修改spu-----两者的参数类似，唯一区别:是否带id
export const addOrEditSpu=(spuInfo)=>{
    // 修改spu
    if(spuInfo.id){
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else{
    // 添加spu
        return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }
}

// 删除spu
export const deleteSPU=(spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

// skuForm模块接口
// 获取图片数据
export const reqSpuImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取销售属性的数据
export const reqSpuSaleAttrList=(spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

// 获取平台属性的数据
export const reqAttrInfoList=(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加sku
export const reqAdsdsku=(skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

// 获取sku列表的数据
export const getSkuInfoList=(spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})