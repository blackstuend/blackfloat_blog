const Account = require("../models/account_db")
const md5 = require('md5');


var admin = {account:"admin",password:"password"}

admin.password = md5(admin.password)





module.exports = async function(){
    await Account.deleteMany({});
    await new Account(admin).save();
}