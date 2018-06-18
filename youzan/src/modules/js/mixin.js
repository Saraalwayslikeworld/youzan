import Foot from 'components/Foot.vue'

let mixin = {
    components:{
        Foot
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
}

export default mixin