import * as tradeMark from '@/api/product/tradeMark'
import * as sku from '@/api/product/sku'
import * as spu from '@/api/product/spu'
import * as attr from '@/api/product/attr'

//统一暴露所有接口，从而所有的组件都可以使用这些接口
export default {
    tradeMark,
    spu,
    sku,
    attr
}