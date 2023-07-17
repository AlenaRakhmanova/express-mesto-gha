const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  getUsersById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), getUsersById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?):\/\/(w{3}\.)?([a-z0-9\-.]*)\/?(([a-z0-9-._~:/?#[\]@!$&'()*+,;=]*)?)#?/i),
  }),
}), updateUserAvatar);

module.exports = router;
