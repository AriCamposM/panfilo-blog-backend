const express = require('express');
const {createComment, deleteComment} = require('../controllers/comments')


const comments = express.Router();


comments.post('/comments/:postId', createComment);

comments.delete('/comments/:postId/:commentId', deleteComment);


module.exports = comments;