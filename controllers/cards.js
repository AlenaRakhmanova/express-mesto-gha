const Card = require('../models/card');
const statusCode = require('../constants/constants');

const getCards = (req, res) => {
  Card.find({}).then((cards) => {
    res.status(statusCode.success).send(cards);
  }).catch(() => {
    res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
  });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || !link) {
    res.status(statusCode.badRequest).send({ message: 'Переданы некорректные данные при создании карточки.' });
    return;
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(statusCode.created).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusCode.badRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(statusCode.notFound).send({ message: 'Переданы некорректные данные для удаления карточки.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCode.badRequest).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusCode.notFound).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(statusCode.success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCode.badRequest).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusCode.notFound).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(statusCode.success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusCode.badRequest).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(statusCode.internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
