<template>
  <div class="container " style="min-height: 597px;">
    <div class="section section-first">
      <div class="block form js-form">
        <input class="js-id" name="id" type="hidden" value="">
        <div class="block-item" style="border-top:0;">
          <label>收货人</label>
          <input type="text" placeholder="请输入姓名" name="user_name" v-model.trim="name" maxlength="20">
        </div>
        <div class="block-item">
          <label>联系电话</label>
          <input type="tel" placeholder="联系电话" name="tel" v-model.trim="tel" maxlength="11">
        </div>
        <div class="block-item">
          <label>选择地区</label>
          <div class="select-group">
            <select class="js-province-selector" v-model="provinceValue">
              <option value="-1">选择省份</option>
              <option :value="p.value" v-for="p in addressData.list" :key="p.value">{{p.label}}</option> 
            </select>
            <select class="js-city-selector" v-model="cityValue">
              <option value="-1">选择城市</option>
              <option :value="c.value" v-for="c in cityList" :key="c.value">{{c.label}}</option>
            </select>
            <select class="js-county-selector" name="area_code" data-code="" v-model="districtValue">
              <option value="-1">选择地区</option>
              <option :value="d.value" v-for="d in districtList" :key="d.value">{{d.label}}</option>
            </select>
          </div>
        </div>
        <div class="block-item">
          <label>详细地址</label>
          <input type="text" placeholder="街道门牌信息" name="address_detail" v-model.trim="address" maxlength="100">
        </div>
      </div>
      <p class="errMsg" v-show="isError">{{errMsg}}</p>
    </div>
    <div class="block section js-save block-control-btn" @click="add">
      <div class="block-item c-blue center">保存</div>
    </div>
    <div class="block section js-delete block-control-btn" 
         v-show="type=='edit'"
         @click="remove">
      <div class="block-item c-red center">删除</div>
    </div>
    <div class="block stick-bottom-row center js-save-default" 
         v-show="type=='edit'"
         @click="setDefault">
      <button class="btn btn-standard js-save-default-btn">设为默认收货地址</button>
    </div>
  </div>
</template>

<script>
  import Address from 'js/addressService.js'
  export default{
    data(){
      return {
        name:'',
        tel:'',
        provinceValue:-1,
        provinceName:'',
        cityValue: -1,
        cityName:'',
        districtValue: -1,
        districtName:'',
        address: '',
        id: '',
        type: this.$route.query.type,
        instance: this.$route.query.instance,
        addressData: require('js/address.json'),
        cityList: null,
        districtList: null,
        isError: false,
        errMsg:''
      }
    },
    created(){
      if(this.type==='edit'){
        let ad = this.instance
        this.provinceValue = parseInt(ad.provinceValue)
        this.name = ad.name
        this.tel = ad.tel
        this.address = ad.address
        this.id = ad.id
      }
    },
    methods:{
      msgRule(){
        let name = /^[\u4e00-\u9fa5,\w]{3,12}$/g;
        let tel  = /^1[3578]\d{9}$/;
        let address = /^[\u4e00-\u9fa5,\d,\w]{1,}$/g;
        this.isError = true
        if(!name.test(this.name)){
          this.errMsg = '用户名为3-5个字符'
        }else if(!tel.test(this.tel)){
          this.errMsg = '请填写真实联系电话'
        }else if(this.provinceValue==-1||this.cityValue==-1||this.districtValue==-1){
          this.errMsg = '请选择所在区域'
        }else if(!address.test(this.address)){
          this.errMsg = '请填写合理的地址信息'
        }else{
          this.isError = false
          this.errMsg = ''
        }
      },
      add(){
        this.msgRule()
        if(this.isError)return
        let {name,tel,provinceValue,cityValue,districtValue,provinceName,cityName,districtName,address} = this
        let data = {name,tel,provinceValue,cityValue,districtValue,provinceName,cityName,districtName,address}
        if(this.type==='add'){
          this.$store.dispatch('addAction',data)
        }
        if(this.type==='edit'){
          data.id = this.id
          this.$store.dispatch('updateAction',data)
        }
      },
      remove(){
        if(window.confirm('确认删除？')){
          this.$store.dispatch('removeAction',this.id)
        }
      },
      setDefault(){
        this.$store.dispatch('setDefaultAction',this.id)
      }
    },
    computed:{
      lists(){
        return this.$store.state.lists
      }
    },
    watch:{
      lists:{
        handler(){
          this.$router.go(-1)
        },
        deep: true
      },
      provinceValue(val){
        if(val==-1)return
        let list = this.addressData.list
        let index = list.findIndex(item=>{
          return item.value === val
        })
        this.provinceName = list[index].label
        this.cityList = list[index].children 
        this.cityValue = -1
        this.districtValue = -1   
        if(this.type=='edit'){
          this.cityValue = (this.instance.cityValue)
        }
      },
      cityValue(val){
        // if(val==-1)return
        let index = this.cityList.findIndex(item=>{
          return item.value == val
        })
        this.cityName = this.cityList[index].label
        this.districtList = this.cityList[index].children
        this.districtValue = -1 
        if(this.type=='edit'){
        this.districtValue = (this.instance.districtValue)
        }
      },
      districtValue(val){
        // if(val==-1)return
        let index = this.districtList.findIndex(item=>{
          return item.value == val
        })
        this.districtName = this.districtList[index].label
      }
    }
  }
</script>

<style scoped>
  @import './address_base.css';
  @import './address.css';
  .errMsg {
    text-align: center;
    color:rgb(189, 77, 77);
    font-size: 14px;
    margin: 8px;
  }
</style>


