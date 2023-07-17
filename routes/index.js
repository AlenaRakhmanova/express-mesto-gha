const router = require('express').Router();
const userRoutes = require('./users');
const cardRouter = require('./cards');
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

// router.get('*', (req, res) => {
//   res.status(404).send({ message: 'NotFoundError' });
// });
router.use('/', signinRouter);
router.use('/', signupRouter);
router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
