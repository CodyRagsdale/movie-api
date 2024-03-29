/**
 * @fileOverview Defines the Mongoose schemas for Movie and User collections in MongoDB.
 * Provides helper methods for hashing and validating passwords.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Movie schema definition.
 * @typedef {Object} Movie
 * @property {string} title - The title of the movie. Required.
 * @property {string} description - A brief description of the movie. Required.
 * @property {Object} genre - Information about the genre of the movie.
 * @property {string} genre.name - The name of the genre.
 * @property {string} genre.Description - A description of the genre.
 * @property {Object} director - Information about the director of the movie.
 * @property {string} director.Name - The name of the director.
 * @property {string} director.Bio - A biography of the director.
 * @property {string[]} actors - A list of actors who starred in the movie.
 * @property {string} ImagePath - The path to an image representing the movie.
 * @property {boolean} Featured - Whether the movie is featured or not.
 */
let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: String,
    Description: String,
  },
  director: {
    Name: String,
    Bio: String,
  },
  actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

/**
 * User schema definition.
 * @typedef {Object} User
 * @property {string} username - The username. Required.
 * @property {string} password - The password. Required.
 * @property {string} email - The email address. Required.
 * @property {Date} birthday - The user's date of birth.
 * @property {Array} favorites - A list of favorite movie IDs.
 */
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hash a password.
 * @function
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validate a password.
 * @function
 * @param {string} password - The password to validate.
 * @returns {boolean} Whether the password is valid or not.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/** Mongoose model for movie data */
let Movie = mongoose.model("Movie", movieSchema);

/** Mongoose model for user data */
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
