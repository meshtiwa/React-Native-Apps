require('./models/User');
require('./models/Track');
const express = require('express'); //creating our express API
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //used to automatically handle incoming json information
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');


const app = express(); //assigning the API

app.use(express.json()); //take in JSON information
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://pople:1234@cluster0.9t7sc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true, //these are properties to prevent common errors
    useCreateIndex: true
});

mongoose.connection.on('connected', () => { //if database connects
    console.log('Connected to mongo instance');
});
mongoose.connection.on('error', err => { //if an error occurs
    console.error('Error connecting to mongo', err);
});

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});
app.listen(3000, () => {
    console.log('Listening on port 3000')
});