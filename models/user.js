var mongoose=require('mongoose')
var userSchema=new mongoose.Schema({
  name:{
       type:String,
       required: 'This field is required.'
   },
  address:{
       type:String
   },
  email:{
       type:String
   },
   mobile:{
       type:String
   },
   filename:{
       type:String
   }
});
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

var mongooseModel=mongoose.model('userModel',userSchema)