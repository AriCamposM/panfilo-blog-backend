const fs = require('fs');
const Post = require('../models/post');
const path = require('path');
const mongoose = require('mongoose');


module.exports.createPost = ( req, res ) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const newPost = new Post({
        title: req.body.title,
        date: new Date(),
        description: req.body.description,
        image: `/uploads/${req.file.filename}`,
        likes: 0,
        comments: [],
    });

    newPost.save()
    .then(post => {
        res.status(201).json(post);
    })
    .catch(error =>{
        console.error(error);
        res.status(500).json({ message:'Error Saving The Post'});
    })
};


module.exports.getPosts = (req, res) => {
    Post.find()
        .populate({
            path: 'comments',
            populate: {
                path: 'user', 
                select: 'name' 
            }
        })
        .then(posts => {
            res.status(200).json(posts); 
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving posts' });
        });
};

module.exports.deletePost = (req, res) => {
    const postId = req.params.postId;
    

    Post.findByIdAndDelete(postId)
        .then((deletedPost) => {
            if (!deletedPost) {
                return res.status(404).send({ message: 'Post no encontrado' });
            }

            const imagePath = path.join(__dirname, '..', 'uploads', path.basename(deletedPost.image));
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                    return res.status(500).send({ message: 'Error al eliminar la imagen del servidor' });
                }
                console.log('Imagen eliminada exitosamente');
            });

            res.send({ message: 'Post eliminado exitosamente', post: deletedPost });
        })
        .catch((err) => {
            res.status(500).send({ message: 'Error al eliminar el post', error: err.message });
        });
};