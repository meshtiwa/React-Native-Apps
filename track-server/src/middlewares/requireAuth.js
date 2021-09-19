// file is for validating and checking whether the user has a proper webtoken
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers; //"authorization" is lowercase due to it getting lowercased when request is made
    //authorization === 'Bearer siodfjaiojfa'

    if (!authorization) { //if authorization fails
        return res.status(401).send({ error: 'You must be logged in!'})
    }

    const token = authorization.replace('Bearer ', '');
    
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => { //verification of the token
        if (err) {
            return res.status(401).send({ error: 'You must be logged in!'});
        }

        const { userId } = payload;

        const user = await User.findById(userId); //tells mongoose to look at the user collection and find the user by the id extracted from the payload and assign it
        req.user = user;
        next();
    }
    );
};
