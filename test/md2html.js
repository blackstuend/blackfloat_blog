

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/my_database', { useNewUrlParser: true });

const Post = require("../models/db")
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});
(async function(){
    var showdown = require('showdown'),
    converter = new showdown.Converter()
    var data = await Post.findOne({Title:"off-canvas 點擊旁邊自動消失"});
    data = converter.makeHtml(data.Content)
    console.log(data)
    await mongoose.connection.close()
})()
