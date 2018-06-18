import 'css/common.css'
import './search.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'

import mixin from 'js/mixin'

import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);
import Velocity from 'velocity-animate'

let {keyword,id} = qs.parse(location.search.substr(1))

new Vue ({
    el:'.container',
    data:{
        keyword,
        id,
        pageNum: 0,
        pageSize: 8,
        searchList : null,
        loading: false,
        over: false,
        show: false
    },
    created(){
        // this.getSearchList()
    },
    methods:{
        getSearchList(){
            if(this.Over)return
            this.loading = true
            axios.post(url.search,{   
                    keyword:this.keyword,
                    id: this.id,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }).then( res => {
                let curList = res.data.lists
                if(curList.length < this.pageSize){
                    this.Over = true
                }
                if(this.searchList){
                    this.searchList = this.searchList.concat(curList)
                }else{
                    this.searchList = curList
                }
            })
            this.pageNum ++
            this.loading = false
        },
        move(){
            if(document.documentElement.scrollTop > 100){
                this.show = true
            }else{
                this.show = false
            }
        },
        toTop(){
        //    document.documentElement.scrollTo(0,0)
           Velocity(document.body,'scroll',{duration:500})
        }

    },
    mixins:[mixin]
})