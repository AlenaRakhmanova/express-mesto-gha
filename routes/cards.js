const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:id', deleteCard);

router.put('/:id/likes', addLike);

router.delete('/:id/likes', deleteLike);

module.exports = router;
