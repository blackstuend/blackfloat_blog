const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/my_database', {useNewUrlParser: true});

const Post = require("../models/db")
const Account = require("../models/account_db")
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});



// var post = {Categories:"js5",Title:"Jquery5",Tags:[123,567],Description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi dolores sint dolorem molestiae eligendi, minus ex. Sunt, magnam! Assumenda nisi a incidunt ratione sed magni corrupti sequi deserunt dolorem molestias.",UpDate:new Date(),Content:"test test3"};
var admin = {account:"admin",password:"password"};
(async function(){
    // await new Post(post).save();
    // let data = await Post.find({})
    // console.log("data is",data) 
    await new Account(admin).save();
    await mongoose.connection.close()
    // await new Account(admin).save();
})()





