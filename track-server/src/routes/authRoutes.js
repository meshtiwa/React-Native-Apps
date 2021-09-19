const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => { //making a POST request to "signup"
    const { email, password } = req.body; //the json information (the login info) being communicated to the API

    try {
        const user = new User({ email, password }); //creating a new instance of a User
        await user.save(); //asynchronous operation where mongoose reaches out to the internet to save that information to this instance and validates the information

        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
        res.send({ token });
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide an email and password!'})
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(422).send({ error: 'Email not found'});
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
});

module.exports = router;