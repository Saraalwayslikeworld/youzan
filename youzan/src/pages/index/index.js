import 'css/common.css'
import './index.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'

import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);

import Foot from 'components/Foot.vue'
import Swipe from 'components/Swipe.vue'

let app = new Vue ({
  el: '#app',
  data:{
    hotLists: null,
    pageNum: 1,
    pageSize: 6,
    loading: false,
    allLoaded: false,
    bannerList: null
  },
  components:{
    Foot,Swipe
  },
  created(){
    this.getHotLists()
    this.getBanner()
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
    getBanner(){
      axios.post(url.banner).then( res => {
          this.bannerList = res.data.lists
      })
    }
  }  

})
