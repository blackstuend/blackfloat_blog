const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session');
const index = require('./routes/index')
const users = require('./routes/admin')

// DataBase
const mongoose = require('mongoose')
const Account = require("./models/account_db")

var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB,{useCreateIndex: true,useUnifiedTopology: true,useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
  // we're connected!
});
app.keys = ['BlackFloat'];

// error handler
onerror(app)


const Session_Config = {
  key: 'koa:sess', /** cookie 金鑰 (string) (預設: koa:sess) */
  /** (number || 'session') maxAge 是以毫秒為單位(1000 = 1 秒) (預設: 1 天) */
  /** 'session' 的相關設置將會影響到關閉瀏覽器清除 cookie or session */
  /** 注意: session cookie 若被竊取, 將會導致永不過期的問題 */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) 自動提交 header 資訊 (預設: true) */
  overwrite: true, /** (boolean) 可覆蓋若不覆蓋 (看不懂意思) (預設: true) */ 
  httpOnly: true, /** (boolean) 是否開啟 httpOnly，也就是要不要給 JavaScript 讀取  (預設: true) */
  signed: true, /** (boolean) 是否附上簽名 (看不懂意思) (預設: true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (看不懂意思) (預設: is false) */
  renew: true, /** (boolean) 是否 session 即將到期時自動更新，也就是瀏覽器重新整理後會自動給予新的 session (建議給 true) (預設: is false)*/
};

app.use(session(Session_Config, app));

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


// 初始化登入帳號密碼
require("./init/createaccount")()

module.exports = app
