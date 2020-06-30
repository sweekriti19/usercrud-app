var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var loginSchema=new mongoose.Schema({
  name:{
       type:String,
       required: 'This field is required.'
   },
 
  email:{
       type:String
   },
  password:{
       type:String
  }
});
loginSchema.pre('save', function (next) {
    var login = this;
    bcrypt.hash(login.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      login.password = hash;
      next();
    })
  });
var loginModel=mongoose.model('loginModel',loginSchema)