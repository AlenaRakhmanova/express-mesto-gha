const User = require('../models/user');
const statusCode = require('../constants/constants');

const getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.status(statusCode.success).send(users);
  }).catch(() => {
    res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
  });
};

const getUsersById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(statusCode.notFound).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(statusCode.success).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCode.badRequest).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res.status(statusCode.badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    return;
  }

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(statusCode.created).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCode.badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((newData) => {
      if (newData) {
        res.status(statusCode.success).send(newData);
      } else {
        res.status(statusCode.notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCode.badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(statusCode.badRequest).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(statusCode.badRequest).send({ message: 'Переданы некорректные данные.' });
    return;
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((newData) => {
      if (newData) {
        res.status(statusCode.success).send(newData);
      } else {
        res.status(statusCode.notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCode.badRequest).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(statusCode.badRequest).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  updateUserAvatar,
};
