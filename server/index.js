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
// import authRouter from './routes/auth.js';
// import models from './models.js';

const MongoStore = connectMongo(session);
mongoose.connect(process.env.MONGODB_URI, {
  newUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected...")
})
.catch((err) => {
  console.error(err)
})
const app = express();
const server = require('http').Server(app);

app.use('/db', dbRouter);
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port: ${port}`);
// });
server.listen(port, () => {
  console.log('Express started. Listening on %s', port);
});
