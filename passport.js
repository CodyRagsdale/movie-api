/**
 * @fileOverview Configures Passport.js strategies for user authentication.
 * Includes JWT-based and local authentication.
 */

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

// Extract relevant models and strategies
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Implement Local Strategy for authentication.
 * @function
 * @param {string} username - Username provided by user.
 * @param {string} password - Password provided by user.
 * @param {function} done - Callback to be executed when authentication is completed.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      console.log(username + "  " + password); // Debugging log

      try {
        // Try to find a user by username
        const user = await Users.findOne({ username: username });

        // If no user is found, return error message
        if (!user) {
          console.log("incorrect username");
          return done(null, false, { message: "Incorrect username." });
        }

        // If user is found, validate password
        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return done(null, false, { message: "Incorrect password." });
        }

        console.log("finished"); // Debugging log
        return done(null, user);
      } catch (error) {
        console.log(error); // Error log for debugging
        return done(error);
      }
    }
  )
);

/**
 * Implement JWT Strategy for authentication.
 * @function
 * @param {Object} jwtPayload - The payload from the JWT.
 * @param {function} done - Callback to be executed when authentication is completed.
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret", // This has to be the same key used in the JWTStrategy
    },
    (jwtPayload, done) => {
      // Try to find user by ID stored in JWT payload
      Users.findById(jwtPayload._id)
        .then((user) => {
          // If user is found, return user object
          if (user) {
            return done(null, user);
          } else {
            // If no user is found, return false to indicate authentication failed
            return done(null, false);
          }
        })
        .catch((error) => {
          // Return error if one is caught
          return done(error, false);
        });
    }
  )
);
