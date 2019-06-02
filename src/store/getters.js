/**
 * 包含基于state的getter计算属性的对象
 */
export default {
    totalCount (state){
        // pretotal:上次计算返回的结果；food：当前操作对象；0：数据初始值
        return state.cartFoods.reduce((preTotal, food) => preTotal + food.count, 0)
    },  
    totalPrice (state){
        return state.cartFoods.reduce((preTotal, food) => preTotal + food.count*food.price, 0)
    }, 
}