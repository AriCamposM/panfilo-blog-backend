const path = require('path')

// Expres.js 
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Mongoose
const mongoose = require('mongoose');

//Ruta Users
const users = require('./routes/users');

//Ruta Posts
const posts = require('./routes/posts');

//Ruta Comments
const comments = require('./routes/comments');


//Cors
const cors = require('cors');




mongoose.connect('mongodb://localhost:27017/panfilo-blog')
.then(() => {
    console.log('Conexion exitosa')
})
.catch(() =>{
    console.log('Conexion Erronea revisa Mongoose')
})


//Habilitar CORS

app.use(cors());
app.options('*', cors());

// Middleware para parcear JSON

app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/',posts)

app.use('/', users);

app.use('/', comments)



app.listen(PORT,()=>{
    console.log(`The server is listening in the port http://localhost:${PORT}/`);
})