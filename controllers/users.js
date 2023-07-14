const bcrypt = require('bcryptjs');
// const { Promise } = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const statusCode = require('../constants/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequest');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(statusCode.success).send(users);
    })
    .catch(next);
};

const getUsersById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      res.status(statusCode.success).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => {
      res.status(statusCode.created).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newData) => {
      if (newData) {
        res.status(statusCode.success).send(newData);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь с указанным _id не найден.'));
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    next(new BadRequestError('Переданы некорректные данные.'));
  }

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newData) => {
      if (newData) {
        res.status(statusCode.success).send(newData);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь с указанным _id не найден.'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError({ message: err.message }));
    });
};

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findOne({ _id: id }).then((user) => {
    if (!user) { throw new NotFoundError('Пользователь с указанным _id не найден'); }
    return res.status(statusCode.success).send(user);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Пользователь с указанным _id не найден.'));
    }
    next(err);
  });
};

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
};
