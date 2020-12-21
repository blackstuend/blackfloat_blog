var mongoose = require('mongoose'),
    Schema = mongoose.Schema


var Post_Schema = new Schema({
    UpDate:{
        type:Date,
        default:Date.now()
    },
    Categories:String,
    Title:String,
    Tags:[String],
    Description:String,
    Content:String
})
Post_Schema.index({Categories:1})
module.exports = mongoose.model('Post', Post_Schema )