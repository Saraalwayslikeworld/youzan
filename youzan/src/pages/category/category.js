import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'

import Foot from 'components/Foot.vue'

new Vue({
    el: '#app',
    data:{
        topList: null,
        topIndex: 0,
        subData: null,
        rankData: null
    },
    components:{
        Foot
    },
    created(){
        this.getTopList()
        this.getRank()
    },
    methods:{
        getTopList(){
            axios.post(url.topList).then( res => {
                this.topList = res.data.lists
            })
        },
        getsubData(index,id){
            this.topIndex = index
            if(index === 0){
                this.getRank()
            }else{
                axios.post(url.subList,{id}).then( res => {
                    this.subData = res.data.data
                })
            }     
        },
        getRank(){
            axios.post(url.rank).then( res => {
                this.rankData = res.data.data
            })
        },
        toSearch(item){
            location.href = `search.html?keyword=${item.name}&id=${item.id}`
        }
    },
    filters:{
        numFilter(price){
            let numString = price.toString()
            let reg1 = /\d+\.\d{1}$/g;
            let reg2 = /\d+\.\d{2}$/g;
            if(reg1.test(numString)){
                return price + '0'
            }else if(reg2.test(numString)){
                return price
            }else {
                return price + '.00'
            }
        }
    }
})