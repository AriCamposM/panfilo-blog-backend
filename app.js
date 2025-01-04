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




mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB correctamente');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});


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