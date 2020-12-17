import express from 'express';
import models from '../models.js';
const router = express.Router();
import CryptoJS from 'crypto-js';
const User = models.User;

function hashPassword(password) {
  return CryptoJS.AES.encrypt(password, 'secret key 123').toString();
}


module.exports = (passport) => {
  const validateReq = userData => (userData.password === userData.password2);
  //======= registration route=======
  router.post('/register', (req, res) => {
    console.log(req.body.username)
    if (!validateReq(req.body)) {
      res.status(401).json({
        success: false,
        message: 'passwords do not match',
      });
    } else {
      const newUser = new User ({
        username: req.body.username,
        password: hashPassword(req.body.password)
      })
      newUser.save()
      .then(() => {
        res.status(200).json({
          success: true,
          message: 'registration successful',
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
    }
  });

  // POST login route
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        res.status(500).json({ success: false, message: 'err or bad user/pass' });
      } else {
        req.login(user, (err) => {
          if (err) {
            res.status(500).json({ success: false, err: err });
          } else {
            res.status(200).json({ success: true, user: req.user });
          }
        });
      }
    })(req, res, next);
  });

  return router;

}
