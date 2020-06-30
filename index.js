require('./models/db')
const express=require('express')
const app=express()
const path = require('path');
const exphbs = require('express-handlebars');
const userController=require('./controller/userController')
var bodyParser=require('body-parser')
const session=require('express-session')
app.use(bodyParser.urlencoded({
extended:true
}))

app.use(bodyParser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
  }));

app.listen(4000,()=>{
console.log("Listening on port 4000")
})

app.use('/user',userController)