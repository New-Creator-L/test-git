import request from '@/utils/request'
import { get } from 'js-cookie'

// 获取sku数据
export const getSkuList=(page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

// 商品的上架
export const reqSale=(skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// 商品的下架
export const reqCancel=(skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// 获取sku商品的详细信息
export const reqGetInfo=(skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})