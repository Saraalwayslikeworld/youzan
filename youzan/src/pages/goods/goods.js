import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods_transition.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import qs from 'qs'
import Swipe from 'components/Swipe.vue'

let {id} = qs.parse(location.search.substr(1))

let detailsTab = ['商品详情','本店成交']

new Vue({
    el: '#app',
    data:{
        id,
        details: null,
        detailsTab,
        curIndex: 0,
        dealList: null,
        skuType: 1,
        skuShow: false,
        skuNum: 1,
        isAddCart: false,
        showAddMessage: false,
        loading: false
    },
    computed:{
        bannerList(){
            let list = []
            this.details.imgs.forEach(el => {
                list.push({
                    clickUrl:'',
                    image: el
                })
            });
            return list
        }
    },
    created(){
        this.getDetails()
        this.getHotLists()
    },
    methods:{
        getHotLists(){
            if(this.allLoaded)return
            this.loading = true        // 正在发送请求时锁定请求
            axios.get(url.hotLists,{
              pageNum: this.pageNum,
              pageSize: this.pageSize
            }).then( res => {
                let curLists = res.data.lists
                // 判断数据是否加载完毕 
                if(curLists.length < this.pageSize){
                  this.allLoaded = true
                }
                if(this.hotLists) {
                  this.hotLists = this.hotLists.concat(curLists)
                }else{
                  //第一次获取数据
                  this.hotLists = curLists
                }
                this.loading = false
                this.pageNum ++
            })
          },
        getDetails(){
            axios.post(url.details,{id}).then( res => {
                this.details = res.data.data
                this.bannerList
            })
        },
        changeTab(index){
            this.curIndex = index
            if(index){    
                this.getDeal()   
            }
        },
        getDeal(){      
            axios.post(url.deal,{id}).then( res => {
                this.dealList = res.data.data.lists
            })
        },
        chooseSku(type){
            this.skuType = type
            this.skuShow = true
        },
        changeSkuNum(num){
            if(this.skuNum===1&&num<0){return}
            this.skuNum += num
        },
        addCart(){
            axios.post(url.cartAdd,{id,number:this.skuNum}).then(res=>{
                if(res.data.status===200){
                    this.isAddCart = true
                    this.showAddMessage = true
                    this.skuShow = false
                }
                setTimeout(()=>{
                    this.showAddMessage = false
                },2000)
            })
        }
    },
    mixins:[mixin],
    components:{
        Swipe
    },
    watch:{
        skuShow(val,oldVal){
            document.body.style.overflow = val?'hidden':'auto'
            document.querySelector('html').style.overflow = val?'hidden':'auto'
            document.body.style.height = val?'100%':'auto'
            document.querySelector('html').style.height = val?'100%':'auto'
        }
    }
})


