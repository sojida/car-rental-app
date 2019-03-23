const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({

    local: {
        fullname : String,
        username : String,
        email : String,
        password : String    
    },

    userDetails: {    
        address1: String,
        address2: String,
        phone: String,
        nextOfKin: String,
        nextOfKinPhone: String,
        dateOfBirth: String,
    },

    google :    {
        id:String,
    },

    facebook :    {
        id:String,
        },

})


//methods
//hashing  met
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//validate password
userSchema.methods.validPassword = function (password){
    return bcrypt.compareSync(password, this.local.password);
};

//export to app
module.exports = mongoose.model('User', userSchema);