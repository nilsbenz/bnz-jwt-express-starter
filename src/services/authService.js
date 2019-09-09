const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../schemas/user');
const bcrypt = require('bcrypt');

const authService = (() => {
  function login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
      User.findOne({username}, async (err, user) => {
        if (err) {
          res.statusCode = 500;
          return res.json({success: false, error: err});
        }
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign(
              {username},
              config.secret,
              {
                expiresIn: '24h'
              }
            );
            return res.json({
              success: true,
              message: 'Authentication successful!',
              token
            });
          }
        }
        res.statusCode = 403;
        return res.json({
          success: false,
          message: 'Incorrect username or password'
        });
      });
    } else {
      res.statusCode = 400;
      return res.json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }

  function register (req, res) {
    let user = new User();
    const {username, password} = req.body;
    user.username = username;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      user.password = hash;
      user.save(err => {
        if (err) {
          res.statusCode = 500;
          return res.json({success: false, error: err});
        }
        return res.json({success: true});
      });
    });
  }

  return {
    login,
    register
  };
})();

module.exports = authService;
