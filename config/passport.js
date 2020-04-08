const LocalStrategy = require('passport-local').Strategy;
// const BearerStrategy = require('passport-http-bearer').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      User.findOne({ username: username })
        .then(user => {
          if(!user) {
            return done(null, false, {message: 'This username is not registered'});
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect'});
            }
          });
        })
        .catch(err => console.log(err));
    })
  );
  // passport.use(new BearerStrategy(
  //   function(token, done) {
  //     User.findOne({ token: token }, function (err, user) {
  //       if (err) { return done(err); }
  //       if (!user) { return done(null, false); }
  //       return done(null, user, { scope: 'all' });
  //     });
  //   }
  // ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log(user.id);
    console.log(user.username);
  });

  passport.deserializeUser((id, done) => {
    try {
      console.log("deserialize?");
      User.findById(id, (err, user) => {
        console.log("Hello");
        done(err, user);
      });
    } catch (e) {
      console.log(e);
    }
  });
  
}