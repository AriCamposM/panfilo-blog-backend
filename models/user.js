const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    admin: { type: Boolean, default: false },
})

userSchema.statics.userFinderByCredentials = function userFinderByCredentials ( email, password){
    return this.findOne({email}).select("+password")
    .then((user) => {
      if (!user){
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password , user.password)
        .then((matched) => {
          if(!matched){
            return Promise.reject(new Error('Incorrect email or password'))
          }

          return user;
        });
    });
  };




module.exports = mongoose.model('User', userSchema);