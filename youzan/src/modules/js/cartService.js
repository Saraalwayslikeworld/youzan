import fecth from 'js/fecth.js'
import url from 'js/api.js'

class Cart {
    static list(){
        return fecth(url.cartList,{})
    }
    static add(id){
        return fecth(url.cartAdd,{
            id,
            number:1
        })
    }
    static reduce(id){
        return fecth(url.cartReduce,{
            id,
            number:-1
        })
    }
    static update(id,number){
        return fecth(url.cartUpdate,{id,number})
    }
    static remove(id){
        return fetch(url.cartRemove,{id})
    }
    static removeM(list){
        let ids = list.map(good=>good.id)
        return fecth(url.cartMremove,{ids})
    }
}

export default Cart