const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, //every email that is tied to a user in the collection is UNIQUE
        required: true //every user MUST have an email property
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) { //if their password hasn't been modified
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => { //"10" is how complex the salt is going to be
        if (err) { //error if there is a problem when trying to generate the salt
            return next(err);
        }
        
        bcrypt.hash(user.password, salt, (err, hash) => { //when the user is first signing up
            if (err) {
                return next(err);
            }
            user.password = hash; //hashed password stored in MongoDB
            next();
        });
    });

});

userSchema.methods.comparePassword = function(candidatePassword) { //"candidatePassword" -> password user is trying to login with
    const user = this;
    
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => { //automation of the password-checking process
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false); //passwords did not match up
            }
            resolve(true);
        });
    });
}

mongoose.model('User', userSchema); 
//*we are not exporting it because a model only needs to be created once, hence, it just needs to execute once