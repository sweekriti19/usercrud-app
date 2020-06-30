const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://admin:admin@cluster0-toie1.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true },function(err){
    if(err)
    throw err
    console.log("DB connected")
})
