const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type:String , required:true},
    date: { type:Date , required:true},
    description: { type:String , required:true},
    image: { type:String , required:true},
    likes: { type:Number , default: 0},
    comments:  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment' 
  }],
});



module.exports = mongoose.model('Post', postSchema);