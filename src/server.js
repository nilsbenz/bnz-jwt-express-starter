const express = require('express');
const bodyParser = require('body-parser');
const authService = require('./services/authService');
let tokenMiddleware = require('./middlewares/tokenMiddleware');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tbz-notes', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('database connected');
});

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/login', authService.login);
app.post('/register', authService.register);
app.get('/', tokenMiddleware.checkToken, (req, res) => res.send('hello world'));

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
