require('dotenv').config();

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const bcrypt = require('bcryptjs');

module.exports.createUser = (   req, res ) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password ){
        return res.status(400).send({ message:'All Fields Are Mandatory'});
    }

    bcrypt.hash(password, 10)
    .then((hash) =>{
        return User.create({email, password:hash, name});
    })
    .then(user =>{
        res.status(201).json(user);
    })
    .catch((err) =>{
    if (err.code === 11000) {
      return res.status(409).send({ message: 'Email already exists' });
    }
    res.status(400).send({ message:'Error creating User', error: err.message})
    });

}


module.exports.logInUser = ( req, res ) => {
    
    const {email , password } = req.body;

    User.userFinderByCredentials( email, password)
    .then((user) => {
        const payload = {
            _id: user._id,
        }

        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRATION});

        return res.send({ token, isAdmin: user.admin, name:user.name, _id:user._id });
    })
    .catch((err) => {
        res.status(401).send({ message: err.message});
    })
}

module.exports.checkToken = (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', ''); 

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {

            return res.status(401).send({ message: 'Token is not valid' });
        }

        User.findById(decoded._id)
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: 'User not found' });
                }
               
                res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.admin 
                });
            })
            .catch(err => {
                res.status(500).send({ message: 'Error retrieving user data', error: err.message });
            });
    });
};