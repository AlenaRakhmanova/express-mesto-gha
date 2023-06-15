const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  }).catch((err) => {
    res.status(500).send(err.message);
  });
};

const getUsersById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(200).send(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(500).send(err.message);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    return;
  }

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(500).send(err.message);
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
        res.status(200).send(newData);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(500).send(err.message);
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((newData) => {
      if (newData) {
        res.status(200).send(newData);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(500).send(err.message);
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  updateUserAvatar,
};
