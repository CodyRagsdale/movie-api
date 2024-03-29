/**
 * @fileOverview Contains the authentication logic for user login and JWT generation.
 */

/**
 * The secret used to sign JWTs.
 * Note: Make sure it's the same as the one used in JWTStrategy.
 * @const {string}
 */
const jwtSecret = "your_jwt_secret";

// Import required modules
const jwt = require("jsonwebtoken"),
  passport = require("passport");

// Import local passport file for strategy configuration
require("./passport");

/**
 * Generate a JSON Web Token for authenticated users.
 *
 * @function
 * @param {Object} user - The user object. Make sure it is sanitized (i.e., without sensitive information like passwords).
 * @returns {string} - A JWT signed with user details.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, //This is the username you're encoding in the JWT
    expiresIn: "7d", //This specifies that the token will expire in 7 days like people who watch the Ring videotape
    algorithm: "HS256", // This is the algorithm used to "sign" or encode the values of the JWT
  });
};

/**
 * Initialize authentication routes.
 *
 * @function
 * @param {Object} router - The express router object where authentication routes are defined.
 */
module.exports = (router) => {
  /**
   * POST login route. Handles user authentication and JWT generation.
   *
   * @function
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      console.log("error:", error); // Debugging log
      console.log("user:", user); // Debugging log
      console.log("info: ", info); // Debugging log

      // Handle error or missing user information
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }

      // Login the user
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }

        // Generate a JWT token
        let token = generateJWTToken(user.toJSON());

        // Return the user and token as JSON
        return res.json({ user, token });
      });
    })(req, res);
  });
};
