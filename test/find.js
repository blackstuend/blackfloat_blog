const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/my_database', {useNewUrlParser: true});

const Post = require("../models/db")
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


var post = {Categories:"js",Title:"Jquery",Tags:[123,567],description:"hello ,world",UpDate:new Date(),Content:"test test"};


 // Find 最新發布的五個文章
// (async function(){
//     let data = await Post.find({}).sort({UpDate:-1}).skip(3).limit(1)
//     console.log("data is",data) 
//     await mongoose.connection.close()
// })()

//

// find categories 有幾個 使用聚合group 
// (async function(){
//   let data = await Post.aggregate([{$group : {_id : "$Categories", sum : {$sum : 1}}}])
//   console.log(data)
//   await mongoose.connection.close()
// })()


// use id to find data
 // Find 最新發布的五個文章
(async function(){
    let id = "5fdf1747f265a42c6c2fa7fd"
    var o_id = new mongoose.Types.ObjectId(id)
    
    let data = await Post.find({_id:o_id})
    console.log("data is",data) 
    await mongoose.connection.close()
})()
