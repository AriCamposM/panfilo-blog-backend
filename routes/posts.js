const express = require('express');
const multer = require('multer');
const { createPost, getPosts, deletePost } = require('../controllers/posts');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Genera un nombre único para cada archivo
    }
});

const upload = multer({ storage: storage }); // Configuración de multer para manejar la subida de archivos

const posts = express.Router();


posts.post('/posts', upload.single('image'), createPost);

posts.get('/posts', getPosts);

posts.delete('/posts/:postId', deletePost);

module.exports = posts;