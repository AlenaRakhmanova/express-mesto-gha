const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).then((cards) => {
    res.status(200).send(cards);
  }).catch((err) => {
    res.status(500).send(err.message);
  });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  // const { owner } = req.user._id;
  // const newCard = req.body;
  // newCard.owner = req.user._id;
  if (!name || !link) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    return;
  }

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send(err.message);
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Переданы некорректные данные для удаления карточки.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(500).send(err.message);
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
        res.status(404).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(500).send(err.message);
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
        res.status(404).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(500).send(err.message);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
