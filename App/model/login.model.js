const mongoose= require('mongoose')
 const Schema = new mongoose.Schema
 const loginschema = new Schema({
    login_id:{
        type: String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
 })
 const LOGIN = mongoose.model('login',loginschema)

 module.exports=LOGIN;