const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth); //dont do anything until login is finished

router.get('/tracks', async(req, res) => { //fetch all the different tracks
    const tracks = await Track.find({ userId: req.user._id }); //find all the tracks through a query calling the Track model with that specific id

    res.send(tracks);
});

router.post('/tracks', async (req, res) => {
    const { name, locations} = req.body; //let the user input their own tracks

    if (!name || !locations){
        return res.status(422).send({ error: 'You must provide a name and locations'});
    }

    try {
        const track = new Track({ name, locations, userId: req.user._id });
        await track.save(); //save this track to our database
        res.send(track);
    } catch (err){
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;