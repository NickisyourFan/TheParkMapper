const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Park = require('./Routes');

//Start Express Server
const app = express();
app.use(cors());

//DB Config
const DB = require('./config/keys').mongoURI;

//Middleware
app.use(express.json());

//Routes
app.use('/api/park', Park);

//Connect DB
mongoose.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then( () => console.log('DB Connected') ).catch( err => console.log(err) );

//setStatic File
app.use(express.static('client/build'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

//Start The Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Yo server is started.'));