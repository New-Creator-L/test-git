//平台属性管理接口

import request from '@/utils/request'

//获取一级分类的数据
export const reqCategoryList1=()=>request({url:'/admin/product/getCategory1',method:'get'})

//获取二级分类的数
export const reqCategoryList2=(category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

//获取三级分类的数据
export const reqCategoryList3=(category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

//获取商品的详细信息
export const reqAttrListInfo=(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//添加或修改商品属性
export const reqAddOrEditorAttr=(data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})