const router = require('express').Router();
const userRoutes = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRouter);

module.exports = router;
