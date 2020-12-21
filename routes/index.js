const router = require('koa-router')()
const showdown =require('showdown')
const Post = require('../models/db')
const mongoose = require("mongoose")
const Showdown_convert = new showdown.Converter()

const converter = new showdown.Converter()

router.get('/', async (ctx, next) => {
    // 找前五篇文章
    var posts = await Post.find({}).sort({UpDate:-1}).skip(0).limit(5)
    // 判斷有幾篇文章
    let sum = await Post.aggregate([{$group : {_id : null, sum : {$sum : 1}}}])
    let needPage = Math.ceil(sum[0].sum / 5 )
    //找到categories 的數量
    let categories = await Post.aggregate([{$group : {_id : "$Categories", sum : {$sum : 1}}}]).sort({sum:-1})
    // render post 為貼文 categories 為分類標籤 ,page 為第幾頁 判斷是否需要往左往右!!
    await ctx.render('index',{posts:posts,categories:categories,NowPage:1,needPage:needPage})
})


router.get('/page/:page', async (ctx, next) => {
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
  await ctx.render('index',{posts:posts,categories:categories,NowPage:NowPage,needPage:needPage})
})


router.get('/content/:id',async(ctx,next) =>{
  let id = ctx.params.id;
  var o_id = new mongoose.Types.ObjectId(id)
  let post = await Post.findOne({_id:o_id})
  post.Content = converter.makeHtml(post.Content)
  await ctx.render("content",{post:post})
})

router.get('/archive',async(ctx,next) =>{
  var archives = await Post.find({}).sort({UpDate:-1})
  var posts = archives.slice(0,5)
  let categories = await Post.aggregate([{$group : {_id : "$Categories", sum : {$sum : 1}}}]).sort({sum:-1})
  console.log(archives)
  await ctx.render("archive",{posts:posts,categories:categories,archives:archives})
})


router.get('/categories',async(ctx,next) =>{
  var posts = await Post.find({}).sort({UpDate:-1})
  let categories = await Post.aggregate([{$group : {_id : "$Categories", sum : {$sum : 1}}}]).sort({sum:-1})
  await ctx.render("categories",{posts:posts,categories:categories})
})



module.exports = router
