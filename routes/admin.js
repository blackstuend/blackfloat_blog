const router = require('koa-router')()
const Post = require("../models/db")

router.prefix('/admin')

router.get('/',async function (ctx, next) {
  await ctx.render('admin')
})


router.post('/post',async function (ctx, next) {
  var data = ctx.request.body;
  // tags 轉 array
  data.Tags = data.Tags.split(",")
  new Post(data).save().then(function(){
    console.log("save success")
  }).catch(function(err){
    console.log(err)
  })

})




module.exports = router
