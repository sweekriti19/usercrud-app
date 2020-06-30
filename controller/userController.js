const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const mongooseModel=require('../models/user')
const User=mongoose.model('userModel')
const loginModel=require('../models/login')
const bcrypt=require('bcrypt')
const Login=mongoose.model('loginModel')
const uploads=require('express-fileupload')
router.use(uploads())

router.get('/login',function(req,res){
    res.render('./users/login',{
        viewTitle:"Login"
    })
})

router.get('/register',function(req,res){
    res.render('./users/register',{
        viewTitle:"Register"
    })
})
router.get('/',function(req,res){
    const sess = req.session;
    if(sess.email) {
    res.render('./users/addoredit',{
        viewTitle:"Insert User"    
    })
}
else{
    res.redirect('/user/login')
}
})
router.post('/login',function(req,res){
    sess = req.session;
    sess.email = req.body.email;
   const email=req.body.email
   const password=req.body.password
   Login.findOne({email:email},function(err,user){
       if(user){
bcrypt.compare(password,user.password,function(err,result){
    if(result==true){
        res.redirect('/user/list')
    }
    else
    console.log("Incorrect email or password")
})
       }
       else{
           console.log("User not found")
       }
   })

})

router.post('/register',function(req,res){
    sess = req.session;
    sess.email = req.body.email;
    const login=new Login()
   login.name = req.body.name; 
    login.email =req.body.email; 
    login.password = req.body.password; 

    login.save((err,docs)=>{
        if(!err){
        res.redirect('/user/list')
        }
            else
                console.log('Error during signup : ' + err);
})
});

router.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/user/login');
        }
      });
    }
  });

  function requiresLogin(req, res, next) {
    if (req.session && req.session._id) {
      return next();
    } else {
     console.log("Error ")
    }
  }

router.post('/',function(req,res){
    if (req.body._id == '')
        insertRecord(req, res);
        
        else
        updateRecord(req, res);
})

function insertRecord(req,res){

    const user=new User()
    user.name=req.body.name
    user.address=req.body.address
    user.email=req.body.email
    user.mobile=req.body.mobile
    user.save((err,docs)=>{
        if(!err){
        res.redirect('/user/list')
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("./users/addOrEdit", {
                    viewTitle: "Insert User",
                    user: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req,res){
   User.findOneAndUpdate({_id:req.body._id},req.body,{new:true},(err,docs)=>{
    if(!err)
    res.redirect('/user/list')
    else {
        if (err.name == 'ValidationError') {
            handleValidationError(err, req.body);
            res.render("users/addOrEdit", {
                viewTitle: 'Update User',
                user: req.body
            });
        }
        else
            console.log('Error during record update : ' + err);
    }
});
}
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/list',function(req,res){
    User.find((err,docs)=>{
        if(!err){
            const context = {
                list: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        address : doc.address,
                        email : doc.email,
                        mobile : doc.mobile
                    }
                })
            }
            const sess = req.session;
            if(sess.email) {
            res.render('./users/list', {
                list: context.list
            })
        }
        else{
            res.redirect('/user/logout')
        }
        }
        else{
            console.log(err)
        }
        }).lean()
        })
router.get('/:id',function(req,res){
User.findById(req.params.id,function(err,docs){
    if(!err){
    const sess = req.session;
    if(sess.email) {
    res.render('./users/addoredit',{
        viewTitle:"Update User",
        user:docs
    })}
    else{
       res.redirect('/user/logout') 
    }
}
    else
    res.redirect('user/list')
})
})

router.get('/delete/:id',function(req,res){
User.findByIdAndRemove(req.params.id,function(err,docs){
    if(!err){
        const sess = req.session;
    if(sess.email) {
    res.redirect('/user/list')
    }
    else{
        res.redirect('/user/logout')
    }
    }
    else
    console.log(err)
})
})


module.exports=router