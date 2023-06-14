const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '648773897021729464fa6609',
  };
  next();
});
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
