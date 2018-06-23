import fecth from 'js/fecth.js'
import url from 'js/api.js'

class Address {
    static list(){
        return fecth(url.addressLists)
    }
    static add(data){
        return fecth(url.addressAdd,data)
    }
    static update(data){
        return fecth(url.addressUpdate,data)
    }
    static remove(id){
        return fecth(url.addressRemove,id)
    }
    static setDefault(id){
        return fecth(url.addressSetDefault,id)
    }
}

export default Address