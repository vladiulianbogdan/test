/*!
=========================================================
* Copyright Codetruck Software (https://codetruck.io)
* Coded by Codetruck Software
=========================================================
* The above copyright informs you that all code is under
  copyright and all the intelectual property rights are owned by Codetruck Software.
*/

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const compression = require('compression');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const mongoURI = require('./config/keys').mongoURI;

require('dotenv').config();

// Instantiate express
const app = express();
app.use(compression());

// DB Config

// Connect to MongoDB
mongoose
    .connect(
        mongoURI, {useNewUrlParser: true,
          useUnifiedTopology: true},
    )
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

app.use(cors());

app.use(requireHTTPS);


// Express body parser
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Initialize routes middleware
app.use('/api/users', require('./routes/users'));

// REACT BUILD for production
if (process.env.NODE_ENV === 'PROD') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT;
https.createServer({
  key: fs.readFileSync(process.env.SSLKEY),
  cert: fs.readFileSync(process.env.SSLCERT),
}, app)
    .listen(PORT, function() {
      console.log('App listening on port ' + PORT + '! Go to https://localhost:' + PORT + '/');
    });


function requireHTTPS(req, res, next) {
  if (!req.secure) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

app.enable('trust proxy');
app.use(function(req, res, next) {
  if (req.secure) {
    return next();
  }
  res.redirect('https://' + req.headers.host + req.url);
});