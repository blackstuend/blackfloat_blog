const router = require('koa-router')()
const Post = require("../models/db")
const Account = require("../models/account_db")
const md5 = require("md5")

router.prefix('/admin')


router.get('/login', async (ctx, next) => {
  if(ctx.session.admin){
    return ctx.redirect("/admin")
  }
  await ctx.render('login',{fail:false})
})

router.post('/login', async (ctx, next) => {
  console.log("login")
  let data = ctx.request.body
  data.password = md5(data.password)
  let admin  = await Account.findOne(data)
  if(admin){
    ctx.session.login_fail = false
    ctx.session.admin = true;
    return ctx.redirect("/admin")
  }
  await ctx.render('login',{fail:true})
})



router.get('/', async (ctx, next) => {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  // 找前五篇文章
  var posts = await Post.find({}).sort({UpDate:-1}).skip(0).limit(5)
  // 判斷有幾篇文章
  let sum = await Post.aggregate([{$group : {_id : null, sum : {$sum : 1}}}])
  let needPage;
  if(sum.length != 0 )
    needPage = Math.ceil(sum[0].sum / 5 )
  else
    needPage = 0
  //找到categories 的數量
  let categories = await Post.aggregate([{$group : {_id : "$Categories", sum : {$sum : 1}}}]).sort({sum:-1})
  // render post 為貼文 categories 為分類標籤 ,page 為第幾頁 判斷是否需要往左往右!!
  await ctx.render('admin',{posts:posts,categories:categories,NowPage:1,needPage:needPage})
})


router.get('/account', async (ctx, next) => {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  await ctx.render("admin-account",{fail:false})
})


router.post('/account', async (ctx, next) => {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  let data = ctx.request.body
  data.password = md5(data.password)
  data.new_password = md5(data.new_password)
  let ok = await Account.updateOne({account:data.account,password:data.password},{password:data.new_password})
  console.log(ok)
  if(ok.nModified == 1)
  {
    ctx.session.admin = false;
    ctx.session.change_fail = false;
    return ctx.redirect("/admin/login")
  }
  else
    await ctx.render("admin-account",{fail:true})
})

router.get('/:page', async (ctx, next) => {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  let NowPage = parseInt(ctx.params.page)
  let skip_page = (NowPage-1)*5;
  // 找前五篇文章
  var posts = await Post.find({}).sort({UpDate:-1}).skip(skip_page).limit(5)
  // 判斷有幾篇文章
  let sum = await Post.aggregate([{$group : {_id : null, sum : {$sum : 1}}}])
  let needPage = Math.ceil(sum[0].sum / 5 )
  //找到categories 的數量
  let categories = await Post.aggregate([{$group : {_id : "$Categories", sum : {$sum : 1}}}]).sort({sum:-1})
  // render post 為貼文 categories 為分類標籤 ,page 為第幾頁 判斷是否需要往左往右!!
  await ctx.render('admin',{posts:posts,categories:categories,NowPage:NowPage,needPage:needPage})
})


router.get('/post/delete/:id', async (ctx, next) => {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  let id = ctx.params.id
  await Post.deleteOne({_id:id})
  await ctx.redirect("back")
})


router.get('/post/newpost', async (ctx, next) => {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  await ctx.render("admin-post",{post:null,Title:"NewPosts"})
})


router.get('/post/update/:id', async (ctx, next) => {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  let id = ctx.params.id;
  let post = await Post.findOne({_id:id})
  post.Tags = post.Tags.join(",")
  console.log(post)
  await ctx.render("admin-post",{post:post,Title:"UpDate"})
})



router.post('/post',async function (ctx, next) {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  var data = ctx.request.body;
  // tags 轉 array
  data.Tags = data.Tags.split(",")
  new Post(data).save().then(function(){
    console.log("save success")
  }).catch(function(err){
    console.log(err)
  })
  await ctx.redirect("/admin")
})


router.post('/update/:id',async function (ctx, next) {
  if(!ctx.session.admin){
    return ctx.redirect("/admin/login")
  }
  let data = ctx.request.body;
  let id = ctx.params.id;
  // tags 轉 array
  data.Tags = data.Tags.split(",")
  await Post.updateOne({_id:id},data)
  ctx.redirect("/admin")
})





module.exports = router
