const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { createUser } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?):\/\/(w{3}\.)?([a-z0-9\-.]*)\/?(([a-z0-9-._~:/?#[\]@!$&'()*+,;=]*)?)#?/i),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = router;
