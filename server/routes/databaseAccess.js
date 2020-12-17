import express from 'express';
import models from '../models.js';
const User = models.User;
import CryptoJS from 'crypto-js';
const router = express.Router();

router.post('/test', (req, res) => {
  const newUser = new User ({
    username: "DWang",
    password: "1234567"
  })
  newUser.save()
  .then((data) => {
    console.log("GEI");
    res.status(200).send(data);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  })
});

export default router;
