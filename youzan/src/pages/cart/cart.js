import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import mixin from 'js/mixin.js'
import Cart from 'js/cartService.js'

import Velocity from 'velocity-animate'

new Vue({
    el:'.container',
    data:{
        lists: null,
        total:0,
        editingShop: null,
        editingShopIndex: -1,
        removePopup: false,
        removeData: null,
        removeMsg:''
    },
    computed:{
        allSelected:{
            get(){                
                if(this.lists&&this.lists.length){
                    return this.lists.every(shop=>{
                        return shop.checked
                    })
                }
                return false
            },
            set(newVal){
                this.lists.forEach(shop=>{
                    shop.checked = newVal
                    shop.goodsList.forEach(good=>{
                        good.checked = newVal
                    })
                })
            }
        },
        allRemoved:{
            get(){
                if(this.editingShop){
                    return this.editingShop.removeChecked
                }
                return false
            },
            set(newVal){
                if(this.editingShop){
                    this.editingShop.removeChecked = newVal
                    this.editingShop.goodsList.forEach(good=>{
                        good.removeChecked = newVal
                    })
                }
            }
        },
        selectedList(){
            if(this.lists&&this.lists.length){
                let arr = []
                let total = 0
                this.lists.forEach(shop=>{
                    shop.goodsList.forEach(good=>{
                        if(good.checked){
                            arr.push(good)
                            total += good.number*good.price
                        }
                    })
                })
                this.total = total
                return arr
            }else{
                return []
            }
        },
        removeList(){
            if(this.editingShop){
                let arr = []
                this.editingShop.goodsList.forEach(good=>{
                    if(good.removeChecked){
                        arr.push(good)
                    }
                })
                return arr
            }else{
                return []
            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            Cart.list().then(res => {
                let lists = res.data.cartList
                lists.forEach( shop =>{
                    shop.checked = false
                    shop.editing = false
                    shop.removeChecked = false
                    shop.editingMsg = '编辑'
                    shop.goodsList.forEach( good => {
                        good.checked = false
                        good.removeChecked = false
                    })
                })
                this.lists = lists
            })

        },
        selectShop(shop){
            let attr = this.editingShop?'removeChecked':'checked'
            shop[attr] = !shop[attr]
            shop.goodsList.forEach( good => {
                good[attr] = shop[attr]
            })
        },
        selectGood(shop,good){
            let attr = this.editingShop?'removeChecked':'checked'
            good[attr] = !good[attr]
            shop[attr] = shop.goodsList.every( good => {
                return good[attr]
            })
        },
        selectAll(){
            let attr = this.editingShop?'allRemoved':'allSelected'
            this[attr]= !this[attr]
        },
        edit(shop,shopIndex){
            shop.editing = !shop.editing
            shop.editingMsg = shop.editing?'完成':'编辑'
            this.lists.forEach((item,i)=>{
                if(shopIndex!==i){
                    item.editing = false
                    item.editingMsg = shop.editing?'':'编辑'
                }
            })
            if(shop.editing){
                this.editingShop = shop
                this.editingShopIndex = shopIndex
            }else{
                this.editingShop = null
                this.editingShopIndex = -1
            }
        },
        addGood(good){
            Cart.add(good.id).then( res => {
                good.number++
            })
        },
        reduceGood(good){
            if(good.number===1)return
            Cart.reduce(good.id).then( res => {
                good.number--
            })
        },
        updateGood(good,val){
            var isNum = /^\d{1,}$/
            if(isNum.test(val) && Number(val)!==0){
                Cart.update(good.id,val).then( res => {
                    good.number = val
                })
            }else{
                return
            }
        },
        removegood(shop,shopIndex,good,goodIndex){
            this.removePopup = true
            this.removeData = {shop,shopIndex,good,goodIndex}
            this.removeMsg = '确定要删除该商品吗？'
        },
        removeLists(){
            this.removePopup = true
            this.removeMsg = `确定要将所选的${this.removeList.length}个商品删除吗？`
        },
        removeConfirm(){
            if(this.removeData){
                let {shop,shopIndex,good,goodIndex} = this.removeData
                Cart.remove(good.id).then(res=>{
                    shop.goodsList.splice(goodIndex,1)
                    if(!shop.goodsList.length){
                        this.lists.splice(shopIndex,1)
                        this.removeShop()
                    }
                })
            }else{
                Cart.removeM(this.removeList).then(res=>{
                    if(this.removeList.length===this.editingShop.goodsList.length){
                        this.lists.splice(this.editingShopIndex,1)
                        this.removeShop()
                    }else{
                        let arr = this.editingShop.goodsList.filter(good=>{return good.removeChecked===false})
                        this.editingShop.goodsList = arr
                    }
                })
            }
            this.removePopup = false
        },
        removeShop(){
            this.editingShop = null
            this.editingShopIndex = -1
            this.lists.forEach(shop=>{
                shop.editing = false
                shop.editingMsg = '编辑'
            })
        },
        start(e,good){
            good.startX = e.changedTouches[0].clientX
        },
        end(e,shopIndex,good,goodIndex){
            let endX = e.changedTouches[0].clientX 
            let dstX =  good.startX - endX
            let left = '0' 
            if(dstX>100){
                left = '-60px'
            }
            if(-dstX>100){
                left = '0px'
            }
            Velocity(this.$refs[`goods-${shopIndex}-${goodIndex}`],{
                left
            })
        }
    },
    mixins:[mixin]
})