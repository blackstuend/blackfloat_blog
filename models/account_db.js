var mongoose = require('mongoose'),
    Schema = mongoose.Schema


var Account_Schema = new Schema({
    account:String,
    password:String
})
Account_Schema.index({account:1})

module.exports = mongoose.model('account', Account_Schema)