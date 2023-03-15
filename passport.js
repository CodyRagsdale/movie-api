const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  console.log(username + '  ' + password);
  try {
    const user = await Users.findOne({ username: username });
    if (!user) {
      console.log('incorrect username');
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return done(null, false, { message: 'Incorrect password.' });
    }

    console.log('finished');
    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(error);
  }
}));

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    (jwtPayload, done) => {
      Users.findById(jwtPayload._id)
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((error) => {
          return done(error, false);
        });
    }
  )
);