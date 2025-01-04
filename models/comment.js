const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    text:{type:String, required:true},
    post:{
            type: mongoose.Schema.Types.ObjectId, 
            ref:'Post', 
            required: true
        },


},{ 
    timestamps: true 
})

module.exports = mongoose.model('Comment', commentsSchema);