import http from 'http';
import createError from 'http-errors';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import connectMongo from 'connect-mongo';
import models from './models.js'
const User = models.User;
import dbRouter from './routes/databaseAccess.js';
import authRouter from './routes/auth.js';
import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex'
import CryptoJS from 'crypto-js';

// ========== Basic connections and server initialization =============

const MongoStore = connectMongo(session);
mongoose.connect(process.env.MONGODB_URI, {
  newUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected...");
})
.catch((err) => {
  console.error(err)
})
const app = express();
const server = require('http').Server(app);

// ========== Middleware =============
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/db', dbRouter);

// ========== Passport =============
function hashPassword(password) {
  return CryptoJS.AES.encrypt(password, 'secret key 123').toString();
}

app.use(session({
  secret: 'sample secret',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);
    } else if (!user) {
      console.log(user);
      return done(null, false);
    } else {
      var hashedPassword = hashPassword(password);
      if (user.hashedPassword !== hashedPassword) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }
  });
}));

//====== initializing passport middleware ======
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter(passport));

// ========== Port init =============
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port: ${port}`);
// });
server.listen(port, () => {
  console.log('Express started. Listening on %s', port);
});
