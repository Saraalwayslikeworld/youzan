import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

let routes = [{
    path:'/',
    component: require('../components/member.vue').default
},{
    path:'/address',
    component: require('../components/address.vue').default,
    children: [{
        path:'',
        redirect: 'all'
        // component: require('./components/from.vue').default
    },{
        path:'all',
        name:'all',
        component: require('../components/all.vue').default
    },{
        path:'form',
        name:'form',
        component: require('../components/form.vue').default
    }]
}]

let router = new VueRouter({
    routes
})

export default router
