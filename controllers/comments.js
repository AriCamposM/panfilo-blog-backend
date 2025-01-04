const Post = require('../models/post');
const mongoose = require('mongoose');
const Comment = require('../models/comment');

module.exports.createComment = (req, res) => {
    const postId = req.params.postId;
    const { userId, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Post ID o User ID no válidos' });
    }

    const newComment = new Comment({
        user: userId,
        text: text,
        post: postId  
    });

    newComment.save()
        .then((comment) => {
            
            Post.findById(postId)
                .then((post) => {
                    if (!post) {
                        return res.status(404).json({ message: 'Post Not Found' });
                    }

                    
                    post.comments.push(comment._id); 

                    post.save()
                        .then(updatedPost => {
                            
                            Post.findById(postId)
                                .populate({
                                    path: 'comments',
                                    populate: {
                                        path: 'user', 
                                        select: 'name' 
                                    }
                                }) 
                                .then((populatedPost) => {
                                    res.status(200).json(populatedPost);  
                                })
                                .catch(error => {
                                    console.error(error);
                                    res.status(500).json({ message: 'Error Populating The Comments' });
                                });
                        })
                        .catch(error => {
                            console.error(error);
                            res.status(500).json({ message: 'Error Updating The Post' });
                        });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ message: 'Error Finding The Post' });
                });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Error Saving The Comment' });
        });
};


module.exports.deleteComment = (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ message: 'Post ID o Comment ID no válidos' });
    }

    
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const commentIndex = post.comments.findIndex(comment => comment.toString() === commentId);

             
            if (commentIndex === -1) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            
            post.comments.splice(commentIndex, 1);

            post.save()
                .then(updatedPost => {

                    Comment.findByIdAndDelete(commentId)
                        .then(() => {
                            res.status(200).json(updatedPost); 
                        })
                        .catch(error => {
                            console.error(error);
                            res.status(500).json({ message: 'Error deleting the comment from the comments collection' });
                        });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ message: 'Error updating the post' });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error finding the post' });
        });
};