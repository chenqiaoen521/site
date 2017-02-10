var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var WebsiteSchema = new Schema({
    name:String,
    webcategory:String,
    language:String,
    product:String,
    account:String,
    password:String,
    serverip:String,
    status:String,
    kDate:Date,
    firstDate:Date,
    isStable:{
        type:Boolean,
        default:null
    },
    user:{
        type:ObjectId,ref:'User'
    },
    uptime:{
        type:Date,
        default:Date.now()
    },
    builder:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{

            type:Date,
            default:Date.now()
        }

    }
})
WebsiteSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{

        this.meta.updateAt = Date.now()
    }
    next()
})

WebsiteSchema.statics = {

    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}
module.exports = WebsiteSchema