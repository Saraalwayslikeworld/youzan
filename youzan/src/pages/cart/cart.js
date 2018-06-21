import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import mixin from 'js/mixin.js'
import axios from 'axios'
import url from 'js/api.js'

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
            axios.post(url.cartList).then(res => {
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
            axios.post(url.cartAdd,{
                id:good.id,
                number: 1
            }).then(res => {
                good.number++
            })
        },
        reduceGood(good){
            if(good.number===1)return
            axios.post(url.cartReduce,{
                id:good.id,
                number: -1
            }).then(res => {
                good.number--
            })
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
            if(this.removeList.length===1){
                let {shop,shopIndex,good,goodIndex} = this.removeData
                axios.post(url.cartRemove,{
                    id: good.id
                }).then(res=>{
                    shop.goodsList.splice(goodIndex,1)
                    if(!shop.goodsList.length){
                        this.lists.splice(shopIndex,1)
                        this.removeShop()
                    }
                })
            }else{
                let ids = this.removeList.map(good=>good.id)
                axios.post(url.cartMremove,{ids}).then(res=>{
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
            this.editing = null
            this.editingShopIndex = -1
            this.lists.forEach(shop=>{
                shop.editing = false
                shop.editingMsg = '编辑'
            })
        }
    },
    mixins:[mixin]
})